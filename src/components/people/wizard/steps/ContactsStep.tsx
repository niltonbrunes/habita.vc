'use client';
import React from 'react';
import { PeopleWizardData } from '../PeopleWizard';
import { Plus, Trash2 } from 'lucide-react';

interface Props {
  data: PeopleWizardData;
  onChange: (patch: Partial<PeopleWizardData>) => void;
}

export function ContactsStep({ data, onChange }: Props) {
  const addContact = () => {
    onChange({
      contacts: [...data.contacts, { id: Date.now().toString(), type: 'phone', value: '', is_primary: data.contacts.length === 0 }]
    });
  };

  const updateContact = (id: string, field: string, value: any) => {
    onChange({
      contacts: data.contacts.map(c => c.id === id ? { ...c, [field]: value } : c)
    });
  };

  const removeContact = (id: string) => {
    onChange({ contacts: data.contacts.filter(c => c.id !== id) });
  };

  const addAddress = () => {
    onChange({
      addresses: [...data.addresses, { 
        id: Date.now().toString(), type: 'residential', zip_code: '', street: '', number: '', neighborhood: '', city: '', state: 'GO', is_primary: data.addresses.length === 0 
      }]
    });
  };

  const updateAddress = (id: string, field: string, value: any) => {
    onChange({
      addresses: data.addresses.map(a => a.id === id ? { ...a, [field]: value } : a)
    });
  };

  const removeAddress = (id: string) => {
    onChange({ addresses: data.addresses.filter(a => a.id !== id) });
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
      
      {/* Contatos */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-heading mb-1">Contatos</h2>
            <p className="text-muted-foreground text-sm">Adicione telefones, WhatsApp e e-mails.</p>
          </div>
          <button onClick={addContact} type="button" className="flex items-center gap-2 px-4 py-2 bg-blue-primary/10 text-primary font-bold rounded-xl hover:bg-blue-primary/20 transition-all">
            <Plus size={16} /> Adicionar
          </button>
        </div>

        <div className="space-y-3">
          {data.contacts.map((contact, idx) => (
            <div key={contact.id} className="flex items-center gap-3 bg-muted/50 p-4 rounded-2xl border border-border">
              <select
                value={contact.type}
                onChange={e => updateContact(contact.id, 'type', e.target.value)}
                className="px-4 py-3 bg-surface border border-border rounded-xl focus:border-primary outline-none font-bold text-primary transition-all w-40"
              >
                <option value="whatsapp">WhatsApp</option>
                <option value="phone">Telefone</option>
                <option value="email">E-mail</option>
                <option value="website">Site</option>
              </select>
              <input type="text"
                value={contact.value}
                onChange={e => updateContact(contact.id, 'value', e.target.value)}
                placeholder={contact.type === 'email' ? 'exemplo@email.com' : '(00) 00000-0000'}
                className="flex-1 px-4 py-3 bg-surface border border-border rounded-xl focus:border-primary outline-none font-bold text-primary transition-all"
              />
              <button type="button" onClick={() => removeContact(contact.id)} className="p-3 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                <Trash2 size={20} />
              </button>
            </div>
          ))}
          {data.contacts.length === 0 && (
            <p className="text-center text-muted-foreground py-4 border-2 border-dashed rounded-2xl">Nenhum contato adicionado.</p>
          )}
        </div>
      </div>

      {/* Endereços */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-heading mb-1">Endereços</h2>
            <p className="text-muted-foreground text-sm">Adicione endereços residenciais ou comerciais.</p>
          </div>
          <button onClick={addAddress} type="button" className="flex items-center gap-2 px-4 py-2 bg-blue-primary/10 text-primary font-bold rounded-xl hover:bg-blue-primary/20 transition-all">
            <Plus size={16} /> Adicionar
          </button>
        </div>

        <div className="space-y-4">
          {data.addresses.map((addr) => (
            <div key={addr.id} className="bg-muted/50 p-6 rounded-xl border border-border space-y-4">
              <div className="flex items-center justify-between">
                <select
                  value={addr.type}
                  onChange={e => updateAddress(addr.id, 'type', e.target.value)}
                  className="px-4 py-2 bg-surface border border-border rounded-lg font-bold text-sm text-primary"
                >
                  <option value="residential">Residencial</option>
                  <option value="commercial">Comercial</option>
                  <option value="correspondence">Correspondência</option>
                </select>
                <button type="button" onClick={() => removeAddress(addr.id)} className="text-red-500 text-sm font-bold flex items-center gap-1 hover:underline">
                  <Trash2 size={14} /> Remover
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input type="text" placeholder="CEP" value={addr.zip_code} onChange={e => updateAddress(addr.id, 'zip_code', e.target.value)} className="px-4 py-3 bg-surface border border-border rounded-xl font-medium" />
                <input type="text" placeholder="Rua / Avenida" value={addr.street} onChange={e => updateAddress(addr.id, 'street', e.target.value)} className="px-4 py-3 bg-surface border border-border rounded-xl font-medium md:col-span-2" />
                <input type="text" placeholder="Número" value={addr.number} onChange={e => updateAddress(addr.id, 'number', e.target.value)} className="px-4 py-3 bg-surface border border-border rounded-xl font-medium" />
                <input type="text" placeholder="Complemento" value={addr.complement || ''} onChange={e => updateAddress(addr.id, 'complement', e.target.value)} className="px-4 py-3 bg-surface border border-border rounded-xl font-medium" />
                <input type="text" placeholder="Bairro" value={addr.neighborhood} onChange={e => updateAddress(addr.id, 'neighborhood', e.target.value)} className="px-4 py-3 bg-surface border border-border rounded-xl font-medium" />
                <input type="text" placeholder="Cidade" value={addr.city} onChange={e => updateAddress(addr.id, 'city', e.target.value)} className="px-4 py-3 bg-surface border border-border rounded-xl font-medium md:col-span-2" />
                <input type="text" placeholder="UF" value={addr.state} onChange={e => updateAddress(addr.id, 'state', e.target.value)} className="px-4 py-3 bg-surface border border-border rounded-xl font-medium" />
              </div>
            </div>
          ))}
          {data.addresses.length === 0 && (
            <p className="text-center text-muted-foreground py-8 border-2 border-dashed rounded-xl">Nenhum endereço adicionado.</p>
          )}
        </div>
      </div>
    </div>
  );
}
