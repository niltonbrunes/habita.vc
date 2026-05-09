'use client';

import React, { useState } from 'react';
import { X, Upload, FileText, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { LeadsService } from '@/services/leads.service';
import { PeopleService } from '@/services/people.service';
import { useAuth } from '@/context/AuthContext';

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

  const handleImport = async () => {
    if (!file || !user || !mapping.name) {
      console.warn('Importação abortada: arquivos ou mapeamentos ausentes', { file: !!file, user: !!user, mappingName: mapping.name });
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
      if (lines.length < 2) throw new Error('O arquivo está vazio ou contém apenas o cabeçalho.');

      const fileHeaders = lines[0].split(delimiter).map(h => h.trim());
      
      const leadsToProcess = lines.slice(1).map(line => {
        const values = line.split(delimiter).map(v => v.trim());
        const rawLead: any = {};
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

      console.log(`Processando ${leadsToProcess.length} leads com vínculo à base de Pessoas...`);
      
      const leadsToInsert = [];
      
      for (const raw of leadsToProcess) {
        // 1. Verificar se a pessoa já existe
        let personId = null;
        const existingPerson = await PeopleService.findByContact(raw.email || raw.phone);
        
        if (existingPerson) {
          personId = existingPerson.id;
        } else {
          // 2. Criar nova pessoa se não existir
          const newPerson = await PeopleService.create({
            name: raw.name,
            person_type: 'PF',
            roles: ['lead'],
            relationship_status: 'novo',
            contacts: [
              ...(raw.email ? [{ id: crypto.randomUUID(), type: 'email', value: raw.email, is_primary: true }] : []),
              ...(raw.phone ? [{ id: crypto.randomUUID(), type: 'whatsapp', value: raw.phone, is_primary: !raw.email }] : [])
            ],
            assigned_to_id: user.id,
            commercial_info: {
              lead_source: raw.source || 'Importação CSV',
              notes: 'Criado automaticamente via importação de leads.'
            }
          } as any);
          personId = newPerson.id;
        }

        // 3. Montar o lead vinculado
        leadsToInsert.push({
          assigned_to_id: user.id,
          person_id: personId, // O VÍNCULO MÁGICO
          name: raw.name,
          email: raw.email,
          phone: raw.phone,
          status: 'lead' as any,
          temperature: 'warm' as any,
          score: 50,
          source: raw.source || 'Importação CSV',
          history: [{ type: 'import', date: new Date().toISOString(), note: 'Importado e vinculado à base de Pessoas.' }]
        });
      }

      await LeadsService.bulkCreate(leadsToInsert);
      
      console.log('Importação e Vínculo concluídos com sucesso!');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Erro na importação unificada:', error);
      alert('Erro na importação: Verifique se o arquivo está no formato correto e se você tem permissão para criar contatos.');
    } finally {
      setLoading(false);
    }
  };

  const isMappingValid = mapping.name !== '';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-primary/20 backdrop-blur-sm" onClick={onClose} />
      
      <div className="bg-white w-full max-w-3xl rounded-[2.5rem] shadow-luxury border border-border relative overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-8 border-b border-border flex justify-between items-center bg-muted/30">
          <div>
            <h2 className="text-2xl font-black text-primary mb-1">Importar Leads</h2>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Carregar planilha de clientes (CSV)</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-xl transition-colors text-muted-foreground">
            <X size={24} />
          </button>
        </div>

        <div className="p-8 space-y-8 overflow-y-auto">
          {!file ? (
            <div className="border-4 border-dashed border-muted rounded-[2rem] p-12 text-center group hover:border-primary/20 hover:bg-muted/30 transition-all cursor-pointer relative">
              <input 
                type="file" 
                accept=".csv"
                onChange={(e) => {
                  setMapping({ name: '', email: '', phone: '', source: '' });
                  handleFileChange(e);
                }}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Upload size={32} className="text-primary" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-2">Selecione seu arquivo CSV</h3>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                O sistema aceita arquivos com delimitador vírgula (,) ou ponto-e-vírgula (;).
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="flex items-center justify-between p-4 bg-primary/5 rounded-2xl border border-primary/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm">
                    <FileText size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-primary">{file.name}</p>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{(file.size / 1024).toFixed(1)} KB • Separador: {delimiter}</p>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Mapping Section */}
                <div className="space-y-4">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Mapeamento de Campos (De/Para)</p>
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
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Prévia dos Dados</p>
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
                <p className="text-xs font-bold text-blue-700 leading-relaxed">
                  Vincule as colunas da sua planilha aos campos do sistema à esquerda. <br/>O campo <span className="underline">Nome</span> é obrigatório para processar a importação.
                </p>
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
              px-12 py-4 rounded-2xl font-black text-sm transition-all shadow-premium flex items-center gap-2
              ${!isMappingValid 
                ? 'bg-muted text-muted-foreground cursor-not-allowed grayscale' 
                : 'bg-primary text-white hover:bg-primary-light'}
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
      className="w-full bg-white border border-border/60 rounded-xl px-4 py-3 text-xs font-bold text-primary outline-none focus:border-accent transition-colors appearance-none cursor-pointer"
    >
      <option value="">Não importar / Ignorar</option>
      {headers.map((h: string, i: number) => (
        <option key={i} value={h}>{h}</option>
      ))}
    </select>
  </div>
);
