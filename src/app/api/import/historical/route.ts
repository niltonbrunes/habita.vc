import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import path from 'path';
import fs from 'fs';

// Helper to convert Excel date numbers to JS Date
function excelDateToDate(serial: any) {
  if (!serial || isNaN(serial)) return null;
  const utc_days = Math.floor(serial - 25569);
  const utc_value = utc_days * 86400;
  const date_info = new Date(utc_value * 1000);
  
  const fractional_day = serial - Math.floor(serial) + 0.0000001;
  let total_seconds = Math.floor(86400 * fractional_day);
  
  const seconds = total_seconds % 60;
  total_seconds -= seconds;
  const minutes = Math.floor(total_seconds / 60) % 60;
  total_seconds -= minutes * 60;
  const hours = Math.floor(total_seconds / (60 * 60));
  
  return new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate(), hours, minutes, seconds);
}

function cleanDocument(doc: any) {
  if (!doc) return null;
  const clean = doc.toString().replace(/\D/g, '');
  return clean || null;
}

function getPersonType(name: string, doc: any) {
  const cleanDoc = cleanDocument(doc);
  if (cleanDoc && cleanDoc.length > 11) return 'PJ';
  const upperName = name.toUpperCase();
  if (
    upperName.includes('LTDA') || 
    upperName.includes('CONDOMINIO') || 
    upperName.includes('CONDOMÍNIO') ||
    upperName.includes('IMOBILIARIA') || 
    upperName.includes('IMOBILIÁRIA') || 
    upperName.includes('S/A') || 
    upperName.includes('S.A.') ||
    upperName.includes('ME') ||
    upperName.includes('EIRELI') ||
    upperName.includes('CNPJ') ||
    upperName.includes('LTDA.')
  ) {
    return 'PJ';
  }
  return 'PF';
}

function mapCategoryToType(category: string) {
  if (!category) return 'Outro';
  const cat = category.toUpperCase();
  if (cat.includes('APARTAMENTO')) return 'Apartamento';
  if (cat.includes('SALA')) return 'Sala Comercial';
  if (cat.includes('LOJA')) return 'Loja';
  if (cat.includes('CASA') || cat.includes('SOBRADO')) return 'Casa';
  if (cat.includes('TERRENO') || cat.includes('LOTE')) return 'Terreno';
  if (cat.includes('GALPÃO') || cat.includes('GALPAO')) return 'Galpão';
  if (cat.includes('PRÉDIO') || cat.includes('PREDIO')) return 'Prédio';
  return 'Outro';
}

export async function GET() {
  try {
    const excelPath = path.join(process.cwd(), 'public/Base_alornesed_SBRUv1.xlsx');
    if (!fs.existsSync(excelPath)) {
      return NextResponse.json({ error: 'Arquivo Excel não encontrado na pasta public.' }, { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const FREDERICO_BRUNES_ID = 'c4980824-975e-4703-825a-e0fb5a45ccd4';
    const workbook = XLSX.readFile(excelPath);
    
    // Load sheets
    const sheetBase = workbook.Sheets['Base completa'];
    const sheetLocador = workbook.Sheets['Locador'];
    const sheetLocatario = workbook.Sheets['Locatario'];
    const sheetFiadores = workbook.Sheets['Fiadores_Garantias'];
    const sheetImoveis = workbook.Sheets['Imóveis'];
    
    const baseRows: any[] = XLSX.utils.sheet_to_json(sheetBase);
    const locadorRows: any[] = XLSX.utils.sheet_to_json(sheetLocador);
    const locatarioRows: any[] = XLSX.utils.sheet_to_json(sheetLocatario);
    const fiadoresRows: any[] = XLSX.utils.sheet_to_json(sheetFiadores);
    const imoveisRows: any[] = XLSX.utils.sheet_to_json(sheetImoveis);

    const stats = {
      propertiesImported: 0,
      peopleImported: 0,
      linkagesImported: 0,
      errors: [] as string[]
    };

    // 1. Load existing people and properties to memory
    const peopleCacheByDoc = new Map<string, string>();
    const peopleCacheByName = new Map<string, string>();
    const { data: existingPeople, error: fetchErr } = await supabase
      .from('people')
      .select('id, name, document_id');
    if (fetchErr) throw fetchErr;
    (existingPeople || []).forEach(p => {
      if (p.document_id) peopleCacheByDoc.set(p.document_id, p.id);
      peopleCacheByName.set(p.name.toUpperCase().trim(), p.id);
    });

    const propertyCacheByRef = new Map<string, string>();
    const { data: existingProperties, error: fetchPropErr } = await supabase
      .from('properties')
      .select('id, reference');
    if (fetchPropErr) throw fetchPropErr;
    existingProperties?.forEach(p => {
      if (p.reference) propertyCacheByRef.set(p.reference, p.id);
    });

    // 2. Build mappings
    const contractToDate = new Map<string, Date>();
    const contractToImovelRef = new Map<string, string>();
    const contractToLocatario = new Map<string, string>();
    
    baseRows.forEach(row => {
      const cid = row.Contrato_ID;
      if (row.Locatario) contractToLocatario.set(cid, row.Locatario);
      if (row.Imovel_ID) contractToImovelRef.set(cid, row.Imovel_ID);
    });
    
    imoveisRows.forEach(row => {
      const cid = row.Contrato_ID;
      if (row['Data Cadastro']) {
        const date = excelDateToDate(row['Data Cadastro']);
        if (date) contractToDate.set(cid, date);
      }
    });

    let totalMs = 0;
    let dateCount = 0;
    contractToDate.forEach(d => {
      totalMs += d.getTime();
      dateCount++;
    });
    const fallbackDate = dateCount > 0 ? new Date(totalMs / dateCount) : new Date();

    // 3. Properties mapping and batch insert
    const propertiesToInsert: any[] = [];
    imoveisRows.forEach(row => {
      const ref = row.Imovel_ID;
      if (!ref || propertyCacheByRef.has(ref)) return;

      const regDate = contractToDate.get(row.Contrato_ID) || fallbackDate;
      const mappedType = mapCategoryToType(row.Categoria);
      
      propertiesToInsert.push({
        registered_by_id: FREDERICO_BRUNES_ID,
        title: `${mappedType.toUpperCase()} - ${row.bairro || row.cidade || 'Goiânia'}`,
        description: row.Documentacao || 'Sem documentação informada.',
        reference: ref,
        transaction_type: 'rent',
        property_category: row.TipoContrato === 'Comercial' ? 'commercial' : 'residential',
        type: mappedType,
        price: 0,
        price_rent: 0,
        price_iptu: 0,
        price_condo: 0,
        area_total: Number(row.area_total) || 0,
        area_useful: Number(row.area_total) || 0,
        rooms: 0,
        suites: 0,
        bathrooms: 0,
        parking_spaces: 0,
        status: 'suspended',
        pattern: 'medium',
        address_street: row.endereco || '',
        address_number: row.numero ? row.numero.toString() : 'S/N',
        address_complement: row.complemento || '',
        address_neighborhood: row.bairro || '',
        address_city: row.cidade || 'Goiânia',
        address_state: row.estado || 'GO',
        address_zip_code: '',
        is_highlight: false,
        images: [],
        metadata: {
          origin: 'historico_locacao',
          imported_at: new Date().toISOString(),
          IPTU_principal: row.IPTU_principal || null,
          Locador_ID: row.Locador_ID || null
        },
        created_at: regDate.toISOString()
      });
    });

    const BATCH_SIZE = 100;
    for (let i = 0; i < propertiesToInsert.length; i += BATCH_SIZE) {
      const batch = propertiesToInsert.slice(i, i + BATCH_SIZE);
      const { data, error } = await supabase.from('properties').insert(batch).select('id, reference');
      if (error) {
        stats.errors.push(`Properties insert error: ${error.message}`);
        throw error;
      }
      data?.forEach(p => {
        if (p.reference) propertyCacheByRef.set(p.reference, p.id);
      });
      stats.propertiesImported += batch.length;
    }

    // 4. People mapping
    const peopleToInsert: any[] = [];
    const peopleInBatch = new Map<string, number>();

    const addPerson = (name: string, cleanDoc: string | null, role: string, contacts: any[], addresses: any[], regDate: Date) => {
      const upperName = name.trim().toUpperCase();
      const key = cleanDoc || upperName;

      if (cleanDoc && peopleCacheByDoc.has(cleanDoc)) return peopleCacheByDoc.get(cleanDoc);
      if (peopleCacheByName.has(upperName)) return peopleCacheByName.get(upperName);

      if (peopleInBatch.has(key)) {
        const idx = peopleInBatch.get(key)!;
        const p = peopleToInsert[idx];
        if (!p.roles.includes(role)) p.roles.push(role);
        return null;
      }

      const type = getPersonType(name, cleanDoc);
      const newIdx = peopleToInsert.length;
      peopleToInsert.push({
        person_type: type,
        name: name.trim(),
        document_id: cleanDoc,
        roles: [role],
        relationship_status: 'ativo',
        commercial_info: { lead_source: 'base de clientes' },
        contacts: contacts || [],
        addresses: addresses || [],
        metadata: { origin: 'historico_locacao', imported_at: new Date().toISOString() },
        assigned_to_id: FREDERICO_BRUNES_ID,
        registered_by_id: FREDERICO_BRUNES_ID,
        created_at: regDate.toISOString(),
        updated_at: new Date().toISOString()
      });
      peopleInBatch.set(key, newIdx);
      return null;
    };

    // Map landlords
    locadorRows.forEach(row => {
      if (!row.Locador) return;
      const regDate = contractToDate.get(row.Contrato_ID) || fallbackDate;
      const cleanDoc = cleanDocument(row['`CPF/CNPJ`']);
      
      const contacts: any[] = [];
      if (row.email) contacts.push({ id: 'email', type: 'email', value: row.email, is_primary: true });
      if (row.telefone1) contacts.push({ id: 'tel1', type: 'phone', value: row.telefone1, is_primary: false });
      if (row.telefone2) contacts.push({ id: 'tel2', type: 'phone', value: row.telefone2, is_primary: false });
      if (row.celular) contacts.push({ id: 'cel', type: 'phone', value: row.celular, is_primary: false });

      const addresses: any[] = [];
      if (row.endereco) {
        addresses.push({
          id: 'addr',
          type: 'residential',
          street: row.endereco,
          number: row.numero ? row.numero.toString() : '',
          neighborhood: row.bairro || '',
          city: row.cidade || 'Goiânia',
          state: row.estado || 'GO',
          zip_code: '',
          is_primary: true
        });
      }
      addPerson(row.Locador, cleanDoc, 'owner', contacts, addresses, regDate);
    });

    // Map tenants
    locatarioRows.forEach(row => {
      if (!row.Locatario) return;
      let regDate = fallbackDate;
      for (const [cid, name] of contractToLocatario.entries()) {
        if (name.toUpperCase().trim() === row.Locatario.toUpperCase().trim()) {
          regDate = contractToDate.get(cid) || fallbackDate;
          break;
        }
      }
      const cleanDoc = cleanDocument(row['`CPF/CNPJ`']);
      const contacts: any[] = [];
      if (row.Email) contacts.push({ id: 'email', type: 'email', value: row.Email, is_primary: true });
      if (row.Telefone1) contacts.push({ id: 'tel1', type: 'phone', value: row.Telefone1, is_primary: false });
      if (row.Telefone2) contacts.push({ id: 'tel2', type: 'phone', value: row.Telefone2, is_primary: false });

      addPerson(row.Locatario, cleanDoc, 'tenant', contacts, [], regDate);
    });

    // Map guarantors
    fiadoresRows.forEach(row => {
      if (!row.NomeSeguro) return;
      const contacts: any[] = [];
      if (row.email) contacts.push({ id: 'email', type: 'email', value: row.email, is_primary: true });
      if (row.telefone1) contacts.push({ id: 'tel1', type: 'phone', value: row.telefone1, is_primary: false });

      const addresses: any[] = [];
      if (row.Endereco) {
        addresses.push({
          id: 'addr',
          type: 'residential',
          street: row.Endereco,
          number: '',
          neighborhood: '',
          city: '',
          state: '',
          zip_code: '',
          is_primary: true
        });
      }
      addPerson(row.NomeSeguro, null, 'guarantor', contacts, addresses, fallbackDate);
    });

    // Insert people
    for (let i = 0; i < peopleToInsert.length; i += BATCH_SIZE) {
      const batch = peopleToInsert.slice(i, i + BATCH_SIZE);
      const { data, error } = await supabase.from('people').insert(batch).select('id, name, document_id');
      if (error) {
        stats.errors.push(`People insert error: ${error.message}`);
        throw error;
      }
      data?.forEach(p => {
        if (p.document_id) peopleCacheByDoc.set(p.document_id, p.id);
        peopleCacheByName.set(p.name.toUpperCase().trim(), p.id);
      });
      stats.peopleImported += batch.length;
    }

    // 5. Link property owners
    const propertyOwnersToInsert: any[] = [];
    locadorRows.forEach(row => {
      const cid = row.Contrato_ID;
      const landlordName = row.Locador;
      const cleanDoc = cleanDocument(row['`CPF/CNPJ`']);
      if (!landlordName) return;

      const propRef = contractToImovelRef.get(cid);
      if (!propRef) return;

      const propertyId = propertyCacheByRef.get(propRef);
      if (!propertyId) return;

      let landlordId = null;
      if (cleanDoc && peopleCacheByDoc.has(cleanDoc)) {
        landlordId = peopleCacheByDoc.get(cleanDoc);
      } else {
        landlordId = peopleCacheByName.get(landlordName.toUpperCase().trim());
      }

      if (propertyId && landlordId) {
        propertyOwnersToInsert.push({
          property_id: propertyId,
          person_id: landlordId,
          ownership_percent: 100,
          owner_type: 'owner'
        });
      }
    });

    for (let i = 0; i < propertyOwnersToInsert.length; i += BATCH_SIZE) {
      const batch = propertyOwnersToInsert.slice(i, i + BATCH_SIZE);
      const { error } = await supabase.from('property_owners').insert(batch);
      if (error) {
        stats.errors.push(`Property owners linkage error: ${error.message}`);
        throw error;
      }
      stats.linkagesImported += batch.length;
    }

    return NextResponse.json(stats);
  } catch (error: any) {
    console.error('Erro na API de importação de histórico:', error);
    return NextResponse.json({ error: error.message, details: error }, { status: 500 });
  }
}
