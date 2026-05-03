'use client';

import React, { useState } from 'react';
import { X, Upload, FileText, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { LeadsService } from '@/services/leads.service';
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
  const [preview, setPreview] = useState<any[]>([]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Simple CSV Preview logic
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        const lines = text.split('\n').slice(0, 6); // Header + 5 lines
        setPreview(lines.map(line => line.split(',')));
      };
      reader.readAsText(selectedFile);
    }
  };

  const handleImport = async () => {
    if (!file || !user) return;

    setLoading(true);
    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const text = event.target?.result as string;
        const lines = text.split('\n');
        const header = lines[0].split(',').map(h => h.trim().toLowerCase());
        
        const leadsToInsert = lines.slice(1).filter(l => l.trim() !== '').map(line => {
          const values = line.split(',');
          const lead: any = {
            assigned_to_id: user.id,
            status: 'lead',
            temperature: 'warm',
            score: 50,
            history: [{ type: 'import', date: new Date().toISOString(), note: 'Importado via CSV.' }]
          };
          
          header.forEach((h, i) => {
            if (h.includes('nome') || h.includes('name')) lead.name = values[i];
            if (h.includes('email')) lead.email = values[i];
            if (h.includes('tel') || h.includes('phone') || h.includes('whatsapp')) lead.phone = values[i];
            if (h.includes('origem') || h.includes('source')) lead.source = values[i];
          });
          
          return lead;
        });

        await LeadsService.bulkCreate(leadsToInsert);
        onSuccess();
        onClose();
      };
      reader.readAsText(file);
    } catch (error) {
      console.error('Erro na importação:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-primary/20 backdrop-blur-sm" onClick={onClose} />
      
      <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-luxury border border-border relative overflow-hidden">
        <div className="p-8 border-b border-border flex justify-between items-center bg-muted/30">
          <div>
            <h2 className="text-2xl font-black text-primary mb-1">Importar Leads</h2>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Carregar planilha de clientes (CSV)</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-xl transition-colors text-muted-foreground">
            <X size={24} />
          </button>
        </div>

        <div className="p-8 space-y-8">
          {!file ? (
            <div className="border-4 border-dashed border-muted rounded-[2rem] p-12 text-center group hover:border-primary/20 hover:bg-muted/30 transition-all cursor-pointer relative">
              <input 
                type="file" 
                accept=".csv"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Upload size={32} className="text-primary" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-2">Selecione seu arquivo CSV</h3>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                Certifique-se de que o arquivo tenha colunas como "Nome", "Email" e "WhatsApp".
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-primary/5 rounded-2xl border border-primary/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm">
                    <FileText size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-primary">{file.name}</p>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
                <button onClick={() => setFile(null)} className="text-xs font-bold text-red-500 hover:underline">Remover</button>
              </div>

              {preview.length > 0 && (
                <div className="space-y-3">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Prévia dos Dados</p>
                  <div className="bg-muted/50 rounded-2xl p-4 overflow-hidden border border-border">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="text-left border-b border-border/50">
                          {preview[0].map((h: string, i: number) => (
                            <th key={i} className="pb-2 font-black text-primary px-2">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="text-muted-foreground">
                        {preview.slice(1).map((row, i) => (
                          <tr key={i} className="border-b border-border/10 last:border-0">
                            {row.map((cell: string, j: number) => (
                              <th key={j} className="py-2 px-2 font-medium truncate max-w-[100px]">{cell}</th>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex items-start gap-3">
                <AlertCircle size={18} className="text-blue-500 shrink-0 mt-0.5" />
                <p className="text-xs font-medium text-blue-700 leading-relaxed">
                  O sistema tentará mapear automaticamente as colunas. Revise os dados acima antes de processar a importação final.
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-2xl font-bold text-sm text-muted-foreground hover:bg-muted transition-all"
            >
              Fechar
            </button>
            <button
              onClick={handleImport}
              disabled={!file || loading}
              className="bg-primary text-white px-10 py-3 rounded-2xl font-black text-sm hover:bg-primary-light transition-all shadow-premium disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : (
                <>
                  <CheckCircle2 size={18} />
                  Processar Importação
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
