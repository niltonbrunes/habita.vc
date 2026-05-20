'use client';
import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProfilesService } from '@/services/profiles.service';
import { InviteMemberModal } from '@/components/team/InviteMemberModal';
import { Profile } from '@/types/database';
import { 
  Users, 
  TrendingUp, 
  Target, 
  ArrowUpRight, 
  Award,
  Filter,
  Search,
  BarChart3,
  Loader2,
  ShieldCheck,
  Ban,
  MoreVertical
} from 'lucide-react';

export default function TeamDashboardPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  useEffect(() => {
    ProfilesService.getAll()
      .then(setProfiles)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleToggleStatus = async (p: Profile) => {
    const newStatus = p.status === 'active' ? 'inactive' : 'active';
    try {
      await ProfilesService.update(p.id, { status: newStatus });
      setProfiles(prev => prev.map(item => item.id === p.id ? { ...item, status: newStatus } : item));
    } catch (err) {
      console.error(err);
      alert('Erro ao atualizar status do usuário.');
    }
  };

  const reloadProfiles = () => {
    ProfilesService.getAll().then(setProfiles).catch(console.error);
  };

  const handleRoleChange = async (p: Profile, newRole: any) => {
    try {
      await ProfilesService.update(p.id, { role: newRole });
      setProfiles(prev => prev.map(item => item.id === p.id ? { ...item, role: newRole } : item));
    } catch (err) {
      console.error(err);
      alert('Erro ao atualizar cargo do usuário.');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-primary tracking-tight">Gestão de Equipe</h1>
            <p className="text-muted-foreground font-medium text-sm">Administre os usuários do sistema e níveis de acesso.</p>
          </div>
          
          <div className="flex gap-3">
             <button onClick={() => setIsInviteOpen(true)} className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl text-sm font-black hover:bg-primary-light transition-all shadow-premium">
              <Users size={18} /> Convidar Membro
            </button>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="bg-white p-8 rounded-[2.5rem] shadow-premium border-2 border-border flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Total de Usuários</p>
                <p className="text-4xl font-black text-primary">{profiles.length}</p>
              </div>
              <div className="w-16 h-16 bg-primary/5 rounded-[1.5rem] flex items-center justify-center text-primary">
                <Users size={32} />
              </div>
           </div>
           <div className="bg-white p-8 rounded-[2.5rem] shadow-premium border-2 border-border flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Usuários Ativos</p>
                <p className="text-4xl font-black text-green-500">{profiles.filter(p => p.status !== 'inactive').length}</p>
              </div>
              <div className="w-16 h-16 bg-green-50 rounded-[1.5rem] flex items-center justify-center text-green-500">
                <ShieldCheck size={32} />
              </div>
           </div>
           <div className="bg-white p-8 rounded-[2.5rem] shadow-premium border-2 border-border flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Cargos de Gestão</p>
                <p className="text-4xl font-black text-accent">{profiles.filter(p => p.role !== 'broker').length}</p>
              </div>
              <div className="w-16 h-16 bg-accent/5 rounded-[1.5rem] flex items-center justify-center text-accent">
                <Target size={32} />
              </div>
           </div>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-premium border-2 border-border overflow-hidden">
          <div className="p-8 border-b border-border flex flex-col md:flex-row justify-between items-center gap-4">
             <div className="relative w-full md:w-96">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input 
                  type="text" 
                  placeholder="Buscar por nome ou CRECI..." 
                  className="w-full pl-12 pr-4 py-3 bg-muted/30 border-2 border-transparent focus:border-primary/20 rounded-xl font-bold transition-all outline-none" style={{ paddingLeft: "3rem" }}
                />
             </div>
             <div className="flex items-center gap-2">
                <button className="p-3 bg-muted/30 rounded-xl hover:bg-muted transition-all text-muted-foreground"><Filter size={20} /></button>
             </div>
          </div>
          
          {loading ? (
            <div className="p-20 flex flex-col items-center justify-center">
              <Loader2 className="animate-spin text-primary mb-4" size={40} />
              <p className="font-bold text-muted-foreground">Carregando quadro de equipe...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-black text-muted-foreground uppercase tracking-widest bg-muted/10">
                    <th className="py-6 px-8">Membro da Equipe</th>
                    <th className="py-6 px-4">CRECI</th>
                    <th className="py-6 px-4 text-center">Nível de Acesso</th>
                    <th className="py-6 px-4 text-center">Status</th>
                    <th className="py-6 px-8 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {profiles.map(member => (
                    <tr key={member.id} className="hover:bg-muted/10 transition-colors group">
                      <td className="py-6 px-8">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-muted rounded-2xl overflow-hidden flex items-center justify-center font-black text-primary border-2 border-white shadow-sm">
                            {member.avatar_url ? (
                              <img src={member.avatar_url} alt="" className="w-full h-full object-cover" />
                            ) : (
                              member.full_name.substring(0, 2).toUpperCase()
                            )}
                          </div>
                          <div>
                            <p className="font-black text-primary">{member.full_name}</p>
                            <p className="text-xs font-medium text-muted-foreground">{member.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-6 px-4 font-bold text-sm text-primary/70">{member.creci || '---'}</td>
                      <td className="py-6 px-4 text-center">
                        <select 
                          value={member.role}
                          onChange={(e) => handleRoleChange(member, e.target.value)}
                          className="px-4 py-2 bg-muted/30 rounded-xl text-xs font-black uppercase tracking-wider text-primary outline-none focus:border-primary/20 border-2 border-transparent"
                        >
                          <option value="broker">Corretor</option>
                          <option value="manager">Gerente</option>
                          <option value="director">Diretor</option>
                          <option value="admin">Administrador</option>
                        </select>
                      </td>
                      <td className="py-6 px-4 text-center">
                        <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${member.status === 'inactive' ? 'bg-red-50 text-red-500 border border-red-100' : 'bg-green-50 text-green-600 border border-green-100'}`}>
                          {member.status === 'inactive' ? 'Inativo' : 'Ativo'}
                        </span>
                      </td>
                      <td className="py-6 px-8 text-right">
                        <div className="flex items-center justify-end gap-2">
                           <button 
                            onClick={() => handleToggleStatus(member)}
                            className={`p-3 rounded-xl transition-all ${member.status === 'inactive' ? 'bg-green-50 text-green-600 hover:bg-green-600 hover:text-white' : 'bg-red-50 text-red-400 hover:bg-red-500 hover:text-white'}`}
                            title={member.status === 'inactive' ? 'Ativar Acesso' : 'Bloquear Acesso'}
                           >
                             {member.status === 'inactive' ? <ShieldCheck size={18} /> : <Ban size={18} />}
                           </button>
                           <button className="p-3 bg-muted/30 text-muted-foreground rounded-xl hover:bg-primary hover:text-white transition-all">
                             <MoreVertical size={18} />
                           </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      <InviteMemberModal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        onSuccess={() => { setIsInviteOpen(false); reloadProfiles(); }}
      />
    </DashboardLayout>
  );
}
