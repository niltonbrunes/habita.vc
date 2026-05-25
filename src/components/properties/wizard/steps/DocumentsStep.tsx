'use client';
import React, { useRef } from 'react';
import { Upload, Trash2, FileText, FileCheck2, Loader2 } from 'lucide-react';

export interface DocItem {
  id: string;
  name: string;
  url?: string;
  file?: File;
  doc_type: string;
  uploading?: boolean;
}

interface Props {
  documents: DocItem[];
  onChange: (docs: DocItem[]) => void;
}

const DOC_TYPES = [
  { value: 'escritura',  label: 'Escritura' },
  { value: 'matricula',  label: 'Matrícula' },
  { value: 'iptu',       label: 'IPTU' },
  { value: 'contrato',   label: 'Contrato' },
  { value: 'procuracao', label: 'Procuração' },
  { value: 'other',      label: 'Outro' },
];

export function DocumentsStep({ documents, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = (files: FileList | null) => {
    if (!files) return;
    const newDocs: DocItem[] = Array.from(files).map(f => ({
      id: `${Date.now()}-${Math.random()}`,
      name: f.name,
      file: f,
      doc_type: 'other',
    }));
    onChange([...documents, ...newDocs]);
  };

  const updateType = (id: string, doc_type: string) => {
    onChange(documents.map(d => d.id === id ? { ...d, doc_type } : d));
  };

  const remove = (id: string) => onChange(documents.filter(d => d.id !== id));

  const formatSize = (bytes?: number) => {
    if (!bytes) return '';
    if (bytes > 1e6) return `${(bytes / 1e6).toFixed(1)} MB`;
    return `${(bytes / 1e3).toFixed(0)} KB`;
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-heading mb-1">Documentos do Imóvel</h2>
        <p className="text-muted-foreground text-sm">Escritura, matrícula, IPTU e outros documentos. Esta etapa é opcional.</p>
      </div>

      {/* Drop zone */}
      <div
        className="border-2 border-dashed border-border rounded-xl p-10 flex flex-col items-center gap-4 cursor-pointer hover:border-primary/40 bg-muted/20 transition-all"
        onClick={() => inputRef.current?.click()}
      >
        <Upload className="text-primary/30" size={36} />
        <div className="text-center">
          <p className="font-black text-primary">Clique para adicionar documentos</p>
          <p className="text-sm text-muted-foreground">PDF, Word, imagens — máx. 20MB por arquivo</p>
        </div>
        <input ref={inputRef} type="file" multiple accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" className="hidden"
          onChange={e => addFiles(e.target.files)} />
      </div>

      {/* Document list */}
      {documents.length > 0 && (
        <div className="space-y-3">
          {documents.map(doc => (
            <div key={doc.id} className="flex items-center gap-4 p-4 bg-surface border-2 border-border rounded-2xl">
              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center shrink-0">
                {doc.uploading ? (
                  <Loader2 className="animate-spin text-primary" size={22} />
                ) : doc.url ? (
                  <FileCheck2 className="text-green-500" size={22} />
                ) : (
                  <FileText className="text-primary/40" size={22} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-primary text-sm truncate">{doc.name}</p>
                {doc.file && <p className="text-xs text-muted-foreground">{formatSize(doc.file.size)}</p>}
              </div>
              <select
                value={doc.doc_type}
                onChange={e => updateType(doc.id, e.target.value)}
                className="px-3 py-2 text-xs font-bold border border-border rounded-xl bg-surface outline-none focus:border-primary"
              >
                {DOC_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
              {doc.url && (
                <a href={doc.url} target="_blank" rel="noopener" className="p-2 text-primary hover:text-accent transition-colors">
                  <FileCheck2 size={18} />
                </a>
              )}
              <button type="button" onClick={() => remove(doc.id)}
                className="p-2 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
