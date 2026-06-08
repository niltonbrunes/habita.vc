'use client';

import React, { useState } from 'react';
import { X, Upload, FileText, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { LeadsService } from '@/services/leads.service';
import { PeopleService } from '@/services/people.service';
import { PropertiesService } from '@/services/properties.service';
import { useAuth } from '@/context/AuthContext';
import { Building, MapPin, Search as SearchIcon } from 'lucide-react';

interface ImportLeadsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ImportLeadsModal = ({ isOpen, onClose, onSuccess }: ImportLeadsModalProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<string[][]>([]);
  const [mapping, setMapping] = useState<Record<string, string>>({
    name: '',
    email: '',
    phone: '',
    source: ''
  });
  const [delimiter, setDelimiter] = useState(',');
  const [globalSource, setGlobalSource] = useState('');

  // Date mode states
  const [dateMode, setDateMode] = useState<'today' | 'global' | 'column'>('today');
  const [globalDate, setGlobalDate] = useState(''); // formato YYYY-MM (month picker)
  const [dateColumnMapping, setDateColumnMapping] = useState(''); // nome da coluna CSV com a data
  
  // Produto Vinculado (Opcional)
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [selectedPropertyTitle, setSelectedPropertyTitle] = useState('');
  const [selectedPropertyPrice, setSelectedPropertyPrice] = useState<number>(0);
  const [selectedPropertyType, setSelectedPropertyType] = useState<'property' | 'development' | null>(null);
  const [propertySearch, setPropertySearch] = useState('');
  const [propertyResults, setPropertyResults] = useState<any[]>([]);
  const [isSearchingProperty, setIsSearchingProperty] = useState(false);

  if (!isOpen) return null;

  const detectDelimiter = (text: string) => {
    const firstLine = text.split('\n')[0];
    const commas = (firstLine.match(/,/g) || []).length;
    const semicolons = (firstLine.match(/;/g) || []).length;
    return semicolons > commas ? ';' : ',';
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        const d = detectDelimiter(text);
        setDelimiter(d);
        
        const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
        if (lines.length > 0) {
          const parsedHeaders = lines[0].split(d).map(h => h.trim());
          const parsedRows = lines.slice(1, 6).map(line => line.split(d).map(c => c.trim()));
          
          setHeaders(parsedHeaders);
          setRows(parsedRows);

          // Auto-mapping logic
          const newMapping: any = { name: '', email: '', phone: '', source: '' };
          parsedHeaders.forEach((h, i) => {
            const lowH = h.toLowerCase();
            if (lowH.includes('nome') || lowH.includes('name')) newMapping.name = h;
            if (lowH.includes('email')) newMapping.email = h;
            if (lowH.includes('tel') || lowH.includes('phone') || lowH.includes('whatsapp') || lowH.includes('cel')) newMapping.phone = h;
            if (lowH.includes('origem') || lowH.includes('source')) newMapping.source = h;
          });
          setMapping(newMapping);
        }
      };
      reader.readAsText(selectedFile);
    }
  };

  // UtilitÃ¡rio de parse de data â€” suporta DD/MM/AAAA, DD/MM/AA, YYYY-MM-DD, MM/YYYY
  const parseDateBR = (raw: string): string | null => {
    if (!raw || !raw.trim()) return null;
    const s = raw.trim();
    // DD/MM/AAAA or DD/MM/AA
    const dmy = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
    if (dmy) {
      let year = parseInt(dmy[3]);
      if (year < 100) year += 2000;
      const month = dmy[2].padStart(2, '0');
      const day = dmy[1].padStart(2, '0');
      return `${year}-${month}-${day}T00:00:00Z`;
    }
    // MM/YYYY
    const my = s.match(/^(\d{1,2})\/(\d{4})$/);
    if (my) return `${my[2]}-${my[1].padStart(2, '0')}-01T00:00:00Z`;
    // YYYY-MM-DD
    const iso = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (iso) return `${s}T00:00:00Z`;
    return null;
  };

  // Resolve o created_at para cada linha com base no dateMode
  const resolveCreatedAt = (fileHeaders: string[], values: string[]): string | null => {
    if (dateMode === 'global' && globalDate) {
      return `${globalDate}-01T00:00:00Z`;
    }
    if (dateMode === 'column' && dateColumnMapping) {
      const idx = fileHeaders.indexOf(dateColumnMapping);
      if (idx !== -1 && values[idx]) return parseDateBR(values[idx]);
    }
    return null; // usa NOW() do Supabase
  };

  const handleImport = async () => {
    if (!file || !user || !mapping.name) {
      console.warn('ImportaÃ§Ã£o abortada: arquivos ou mapeamentos ausentes', { file: !!file, user: !!user, mappingName: mapping.name });
      return;
    }

    setLoading(true);
    try {
      const text = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = (e) => reject(new Error('Erro ao ler arquivo'));
        reader.readAsText(file);
      });

      const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
      if (lines.length < 2) throw new Error('O arquivo estÃ¡ vazio ou contÃ©m apenas o cabeÃ§alho.');

      const fileHeaders = lines[0].split(delimiter).map(h => h.trim());
      
      const leadsToProcess = lines.slice(1).map(line => {
        const values = line.split(delimiter).map(v => v.trim());
        const rawLead: any = { _rawValues: values };
        Object.entries(mapping).forEach(([field, mappedHeader]) => {
          if (mappedHeader) {
            const index = fileHeaders.indexOf(mappedHeader);
            if (index !== -1 && values[index] !== undefined) {
              rawLead[field] = values[index];
            }
          }
        });
        return rawLead;
      });

      console.log(`Processando ${leadsToProcess.length} leads com vÃ­nculo Ã  base de Pessoas...`);
      
      const leadsToInsert = [];
      
      for (const raw of leadsToProcess) {
        // 1. Verificar se a pessoa jÃ¡ existe
        let personId = null;
        const existingPerson = await PeopleService.findByContact(raw.email || raw.phone);
        
        if (existingPerson) {
          personId = existingPerson.id;
        } else {
          // 2. Criar nova pessoa se nÃ£o existir
          const newPerson = await PeopleService.create({
            name: raw.name,
            person_type: 'PF',
            roles: ['lead'],
            relationship_status: 'novo',
            contacts: [
              ...(raw.email ? [{ id: crypto.randomUUID(), type: 'email', value: raw.email, is_primary: true }] : []),
              ...(raw.phone ? [{ id: crypto.randomUUID(), type: 'whatsapp', value: raw.phone, is_primary: !raw.email }] : [])
            ],
            assigned_to_id: user?.id,
            registered_by_id: user?.id,
            commercial_info: {
              lead_source: globalSource || raw.source || 'ImportaÃ§Ã£o CSV',
              notes: 'Criado automaticamente via importaÃ§Ã£o de leads.'
            }
          } as any);
          personId = newPerson.id;
        }

        // Resolver data de entrada
        const createdAt = resolveCreatedAt(fileHeaders, raw._rawValues || []);

        // 3. Montar o lead vinculado
        leadsToInsert.push({
          assigned_to_id: user.id,
          person_id: personId || undefined,
          name: raw.name,
          email: raw.email,
          phone: raw.phone,
          status: 'lead' as any,
          temperature: 'warm' as any,
          score: 50,
          source: globalSource || raw.source || 'ImportaÃ§Ã£o CSV',
          value: selectedPropertyId ? selectedPropertyPrice : undefined,
          interest_description: selectedPropertyType === 'development' ? `Interesse no Empreendimento: ${selectedPropertyTitle}` : undefined,
          property_id: selectedPropertyType === 'property' ? (selectedPropertyId || undefined) : undefined,
          ...(createdAt ? { created_at: createdAt } : {}),
          history: [{ 
            type: 'import', 
            date: new Date().toISOString(), 
            note: selectedPropertyId 
              ? `Importado e vinculado ao ${selectedPropertyType === 'development' ? 'empreendimento' : 'imÃ³vel'}: ${selectedPropertyTitle}` 
              : 'Importado e vinculado Ã  base de Pessoas.' 
          }]
        });
      }

      await LeadsService.bulkCreate(leadsToInsert);
      
      console.log('ImportaÃ§Ã£o e VÃ­nculo concluÃ­dos com sucesso!');
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Erro detalhado na importaÃ§Ã£o:', error);
      const errorMessage = error.message || 'Erro desconhecido';
      alert(`Erro na importaÃ§Ã£o: ${errorMessage}\n\nVerifique se o arquivo estÃ¡ no formato correto (UTF-8) e se os dados sÃ£o vÃ¡lidos.`);
    } finally {
      setLoading(false);
    }
  };

  const isMappingValid = mapping.name !== '';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-blue-primary/20 backdrop-blur-sm" onClick={onClose} />
      
      <div className="bg-surface w-full max-w-3xl rounded-xl shadow-card border border-border relative overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-8 border-b border-border flex justify-between items-center bg-muted/30">
          <div>
            <h2 className="text-xl font-bold text-heading mb-1">Importar Leads</h2>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Carregar planilha de clientes (CSV)</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-surface rounded-xl transition-colors text-muted-foreground">
            <X size={24} />
          </button>
        </div>

        <div className="p-8 space-y-8 overflow-y-auto">
          {/* Seletor de Produto (Opcional) */}
          <div className="space-y-4">
            <p className="text-[10px] font-black text-primary uppercase tracking-widest ml-1">Vincular a um Produto (Opcional)</p>
            {!selectedPropertyId ? (
              <div className="relative">
                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input 
                  type="text"
                  placeholder="Pesquise por nome do imÃ³vel ou empreendimento..."
                  value={propertySearch}
                  onChange={async (e) => {
                    setPropertySearch(e.target.value);
                    if (e.target.value.length > 2) {
                      setIsSearchingProperty(true);
                      const results = await PropertiesService.search(e.target.value);
                      setPropertyResults(results);
                      setIsSearchingProperty(false);
                    } else {
                      setPropertyResults([]);
                    }
                  }}
                  className="w-full pl-12 pr-4 py-4 bg-muted/30 border border-border rounded-2xl font-bold text-primary focus:border-primary focus:bg-surface transition-all outline-none"
                />
                
                {propertyResults.length > 0 && (
                  <div className="absolute z-50 left-0 right-0 mt-2 bg-surface rounded-2xl shadow-card border border-border overflow-hidden">
                    {propertyResults.map(p => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          setSelectedPropertyId(p.id);
                          setSelectedPropertyTitle(p.title);
                          setSelectedPropertyPrice(p.price || 0);
                          setSelectedPropertyType(p._type);
                          setPropertyResults([]);
                          setPropertySearch('');
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-blue-primary/5 transition-colors border-b border-border last:border-0 flex items-center justify-between"
                      >
                        <div>
                          <p className="font-bold text-primary text-sm">{p.title}</p>
                          <p className="text-[10px] text-muted-foreground font-medium">{p.reference || p.address_city}</p>
                        </div>
                        <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider ${
                          p._type === 'development' ? 'bg-accent/10 text-accent' : 'bg-blue-primary/10 text-primary'
                        }`}>
                          {p._type === 'development' ? 'Empreendimento' : 'ImÃ³vel'}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-between p-4 bg-blue-primary/5 border-2 border-primary/10 rounded-2xl animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-primary/10 rounded-xl flex items-center justify-center">
                    <Building className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-primary/50 uppercase tracking-widest mb-0.5">Produto Vinculado</p>
                    <p className="text-sm font-black text-primary uppercase">{selectedPropertyTitle}</p>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    setSelectedPropertyId(null);
                    setSelectedPropertyTitle('');
                  }}
                  className="text-[10px] font-black text-red-500 uppercase hover:underline"
                >
                  Remover VÃ­nculo
                </button>
              </div>
            )}
            <p className="text-[9px] font-medium text-muted-foreground leading-relaxed italic">
              Ao selecionar um produto, todos os leads desta planilha serÃ£o automaticamente vinculados a ele. Deixe em branco se for uma lista geral.
            </p>
          </div>

          <div className="w-full h-px bg-border/40" />

          {!file ? (
            <div className="border-4 border-dashed border-muted rounded-xl p-12 text-center group hover:border-primary/20 hover:bg-muted/30 transition-all cursor-pointer relative">
              <input 
                type="file" 
                accept=".csv"
                onChange={(e) => {
                  setMapping({ name: '', email: '', phone: '', source: '' });
                  handleFileChange(e);
                }}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <div className="w-20 h-20 bg-blue-primary/5 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Upload size={32} className="text-primary" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-2">Selecione seu arquivo CSV</h3>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                O sistema aceita arquivos com delimitador vÃ­rgula (,) ou ponto-e-vÃ­rgula (;).
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="flex items-center justify-between p-4 bg-blue-primary/5 rounded-2xl border border-primary/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-surface rounded-xl flex items-center justify-center text-primary shadow-sm">
                    <FileText size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-primary">{file.name}</p>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{(file.size / 1024).toFixed(1)} KB â€¢ Separador: {delimiter}</p>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    setFile(null);
                    setMapping({ name: '', email: '', phone: '', source: '' });
                  }} 
                  className="text-xs font-bold text-red-500 hover:underline"
                >
                  Remover e trocar arquivo
                </button>
              </div>

              {/* â”€â”€ Data de ReferÃªncia â”€â”€ */}
              <div className="space-y-3">
                <label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">
                  ðŸ“… Data de Entrada dos Leads
                </label>
                <div className="flex gap-2">
                  {(['today', 'global', 'column'] as const).map(mode => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setDateMode(mode)}
                      className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                        dateMode === mode
                          ? 'bg-blue-primary text-white border-blue-primary shadow-md'
                          : 'bg-muted/50 text-muted-foreground border-transparent hover:border-border'
                      }`}
                    >
                      {mode === 'today' ? 'ðŸ“Œ Hoje' : mode === 'global' ? 'ðŸ“… Data Fixa' : 'ðŸ“‹ Por Coluna'}
                    </button>
                  ))}
                </div>

                {dateMode === 'global' && (
                  <div className="space-y-1.5">
                    <p className="text-[9px] font-bold text-muted-foreground">Todos os leads receberÃ£o esta data de entrada:</p>
                    <input
                      type="month"
                      value={globalDate}
                      onChange={e => setGlobalDate(e.target.value)}
                      max={new Date().toISOString().slice(0, 7)}
                      className="w-full px-4 py-3 bg-muted/50 border border-transparent rounded-xl focus:bg-white focus:border-primary/20 outline-none font-bold text-primary transition-all"
                    />
                  </div>
                )}

                {dateMode === 'column' && (
                  <div className="space-y-1.5">
                    <p className="text-[9px] font-bold text-muted-foreground">Coluna da planilha com a data (formato DD/MM/AAAA):</p>
                    <select
                      value={dateColumnMapping}
                      onChange={e => setDateColumnMapping(e.target.value)}
                      className="w-full bg-surface border border-border/60 rounded-xl px-4 py-3 text-xs font-bold text-primary outline-none focus:border-accent transition-colors appearance-none cursor-pointer"
                    >
                      <option value="">Selecionar coluna...</option>
                      {headers.map((h, i) => (
                        <option key={i} value={h}>{h}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
              <div className="w-full h-px bg-border/40" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Mapping Section */}
                <div className="space-y-4">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Mapeamento de Campos (De/Para)</p>
                  
            {/* Origem Global */}
            <div className="space-y-3">
              <label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">Origem Global (Opcional)</label>
              <div className="relative">
                <input
                  type="text"
                  value={globalSource}
                  onChange={(e) => setGlobalSource(e.target.value)}
                  placeholder="Ex: PlantÃ£o FGR, IndicaÃ§Ã£o, etc"
                  list="lead-sources"
                  className="w-full px-4 py-3 bg-muted/50 border border-transparent rounded-xl focus:bg-white focus:border-primary/20 outline-none font-bold text-primary placeholder:text-muted-foreground/40 transition-all"
                />
                <datalist id="lead-sources">
                  <option value="IndicaÃ§Ã£o" />
                  <option value="Base de clientes" />
                  <option value="Network" />
                  <option value="Portais" />
                  <option value="Redes sociais" />
                  <option value="LigaÃ§Ã£o ativa" />
                  <option value="Ponto avanÃ§ado" />
                  <option value="IA ProspecÃ§Ã£o" />
                  <option value="Manual" />
                  <option value="AÃ§Ã£o de Vendas" />
                </datalist>
              </div>
              <p className="text-[9px] font-medium text-muted-foreground leading-relaxed italic">
                Se preenchido, esta origem serÃ¡ aplicada a <strong>todos</strong> os leads da planilha, ignorando o mapeamento de colunas.
              </p>
            </div>
            
            <div className="w-full h-px bg-border/40" />

            <div className="space-y-3">
                    <MappingField 
                      label="Nome do Lead" 
                      field="name" 
                      value={mapping.name} 
                      headers={headers} 
                      onChange={(val: string) => setMapping(prev => ({...prev, name: val}))}
                      required
                    />
                    <MappingField 
                      label="E-mail" 
                      field="email" 
                      value={mapping.email} 
                      headers={headers} 
                      onChange={(val: string) => setMapping(prev => ({...prev, email: val}))}
                    />
                    <MappingField 
                      label="Telefone / WhatsApp" 
                      field="phone" 
                      value={mapping.phone} 
                      headers={headers} 
                      onChange={(val: string) => setMapping(prev => ({...prev, phone: val}))}
                    />
                    <MappingField 
                      label="Origem do Lead" 
                      field="source" 
                      value={mapping.source} 
                      headers={headers} 
                      onChange={(val: string) => setMapping(prev => ({...prev, source: val}))}
                    />
                  </div>
                </div>

                {/* Preview Section */}
                <div className="space-y-4">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">PrÃ©via dos Dados</p>
                  <div className="bg-muted/30 rounded-3xl p-4 overflow-x-auto border border-border/50 max-h-[300px]">
                    <table className="w-full text-[10px]">
                      <thead>
                        <tr className="text-left border-b border-border/50">
                          {headers.map((h, i) => (
                            <th key={i} className="pb-2 font-black text-primary px-2 whitespace-nowrap">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="text-muted-foreground font-medium">
                        {rows.map((row, i) => (
                          <tr key={i} className="border-b border-border/10 last:border-0">
                            {row.map((cell, j) => (
                              <td key={j} className="py-2 px-2 whitespace-nowrap max-w-[150px] truncate">{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-5 rounded-3xl border border-blue-100 flex items-start gap-4">
                <AlertCircle size={20} className="text-blue-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-xs font-bold text-blue-700 leading-relaxed">
                    Vincule as colunas da sua planilha aos campos do sistema Ã  esquerda. <br/>O campo <span className="underline">Nome</span> Ã© obrigatÃ³rio para processar a importaÃ§Ã£o.
                  </p>
                  {dateMode === 'global' && globalDate && (
                    <p className="text-xs text-blue-600 font-bold">ðŸ“… Data de referÃªncia: {globalDate}</p>
                  )}
                  {dateMode === 'column' && dateColumnMapping && (
                    <p className="text-xs text-blue-600 font-bold">ðŸ“‹ Datas individuais da coluna: {dateColumnMapping}</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-8 border-t border-border bg-muted/10 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-8 py-4 rounded-2xl font-bold text-sm text-muted-foreground hover:bg-muted transition-all"
          >
            Fechar
          </button>
          <button
            onClick={handleImport}
            disabled={!file || !isMappingValid || loading}
            className={`
              px-12 py-4 rounded-2xl font-black text-sm transition-all shadow-card flex items-center gap-2
              ${!isMappingValid 
                ? 'bg-muted text-muted-foreground cursor-not-allowed grayscale' 
                : 'bg-blue-primary text-white hover:bg-blue-primary-light'}
              ${loading ? 'opacity-70' : ''}
            `}
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : (
              <>
                <CheckCircle2 size={18} />
                {!isMappingValid ? 'Aguardando Mapeamento' : 'Confirmar e Importar'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

interface MappingFieldProps {
  label: string;
  field: string;
  value: string;
  headers: string[];
  onChange: (val: string) => void;
  required?: boolean;
}

const MappingField = ({ label, value, headers, onChange, required }: MappingFieldProps) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select 
      value={value} 
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-surface border border-border/60 rounded-xl px-4 py-3 text-xs font-bold text-primary outline-none focus:border-accent transition-colors appearance-none cursor-pointer"
    >
      <option value="">NÃ£o importar / Ignorar</option>
      {headers.map((h: string, i: number) => (
        <option key={i} value={h}>{h}</option>
      ))}
    </select>
  </div>
);

