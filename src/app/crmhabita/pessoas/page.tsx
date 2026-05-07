'use client';
import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PeopleService } from '@/services/people.service';
import { Person } from '@/types/people';
import { Search, Plus, User, Building2, Phone, Mail, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function PeopleListPage() {
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('');

  const loadPeople = async () => {
    setLoading(true);
    try {
      const data = await PeopleService.getAll({ search, role: filterRole });
      setPeople(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      loadPeople();
    }, 300);
    return () => clearTimeout(delay);
  }, [search, filterRole]);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8 pb-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-primary tracking-tight">Pessoas</h1>
            <p className="text-muted-foreground text-sm">Gerencie leads, clientes, proprietários e parceiros.</p>
          </div>
          <Link href="/crmhabita/pessoas/novo" className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-2xl hover:bg-primary-light transition-all shadow-premium shrink-0">
            <Plus size={20} /> Nova Pessoa
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-3xl border border-border shadow-sm">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <input type="text"
              placeholder="Buscar por nome, CPF, CNPJ..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-muted/30 border border-border rounded-xl font-medium focus:border-primary focus:bg-white transition-all outline-none"
            />
          </div>
          <select
            value={filterRole}
            onChange={e => setFilterRole(e.target.value)}
            className="px-6 py-3 bg-muted/30 border border-border rounded-xl font-bold text-primary focus:border-primary focus:bg-white transition-all outline-none min-w-[200px]"
          >
            <option value="">Todos os papéis</option>
            <option value="lead">Leads</option>
            <option value="client">Clientes</option>
            <option value="owner">Proprietários</option>
            <option value="broker">Corretores/Parceiros</option>
            <option value="company">Empresas</option>
          </select>
        </div>

        {/* List */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="bg-white h-48 rounded-[2rem] border border-border" />
            ))}
          </div>
        ) : people.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {people.map(person => {
              const primaryContact = person.contacts?.find(c => c.is_primary) || person.contacts?.[0];
              
              return (
                <Link key={person.id} href={`/crmhabita/pessoas/${person.id}`} className="group block bg-white p-6 rounded-[2rem] border-2 border-border hover:border-primary/50 transition-all shadow-sm hover:shadow-premium">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-muted rounded-2xl flex items-center justify-center shrink-0 border border-border group-hover:bg-primary/5 transition-colors">
                      {person.person_type === 'PJ' ? <Building2 className="text-primary" size={24} /> : <User className="text-primary" size={24} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-black text-primary text-lg truncate group-hover:text-accent transition-colors">
                        {person.fantasy_name || person.name}
                      </h3>
                      <div className="flex gap-2 mt-2 flex-wrap">
                        {person.roles?.slice(0,3).map(r => (
                          <span key={r} className="px-2 py-0.5 bg-muted text-muted-foreground text-[10px] font-black uppercase tracking-wider rounded-md">
                            {r}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-border space-y-3">
                    {primaryContact && (
                      <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
                        {primaryContact.type === 'email' ? <Mail size={16} /> : <Phone size={16} />}
                        <span className="truncate">{primaryContact.value}</span>
                      </div>
                    )}
                    {person.document_id && (
                      <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
                        <div className="w-4 flex justify-center font-bold text-[10px]">ID</div>
                        <span className="truncate">{person.document_id}</span>
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-[3rem] border border-border">
            <div className="w-20 h-20 bg-muted rounded-3xl flex items-center justify-center mx-auto mb-6">
              <User className="text-muted-foreground" size={32} />
            </div>
            <h3 className="text-xl font-black text-primary mb-2">Nenhuma pessoa encontrada</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Nenhum registro atende aos filtros atuais. Tente buscar de outra forma ou cadastre uma nova pessoa.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
