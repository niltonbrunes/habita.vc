'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useTasks } from '@/hooks/useTasks';
import { 
  Plus, 
  Calendar as CalendarIcon, 
  Clock, 
  CheckCircle2, 
  Circle, 
  RefreshCw,
  Trash2,
  AlertCircle,
  Briefcase,
  Coffee,
  User,
  MoreVertical
} from 'lucide-react';
import { TaskModal } from '@/components/agenda/TaskModal';

export default function AgendaPage() {
  const { tasks, loading, error, refresh, toggleTask, deleteTask } = useTasks();
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const completedCount = tasks.filter(t => t.completed).length;
  const progressPercent = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'business': return <Briefcase size={16} className="text-blue-500" />;
      case 'personal': return <Coffee size={16} className="text-green-500" />;
      case 'meeting': return <User size={16} className="text-purple-500" />;
      default: return <CalendarIcon size={16} className="text-muted-foreground" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-20 max-w-5xl relative">
        {loading && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-20 flex items-center justify-center min-h-[400px]">
            <RefreshCw className="animate-spin text-primary" size={32} />
          </div>
        )}

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-1">Agenda Inteligente</h1>
            <p className="text-muted-foreground text-sm font-medium">Seu monitor de ações diárias e compromissos pessoais.</p>
          </div>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl text-sm font-black hover:bg-primary-light transition-all shadow-premium"
          >
            <Plus size={20} /> Novo Agendamento
          </button>
        </div>

        <TaskModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={refresh} 
        />

        {error && (
          <div className="bg-red-50 border border-red-100 p-6 rounded-[2rem] flex items-center gap-4 text-red-600 animate-in fade-in duration-500">
            <AlertCircle size={24} />
            <div>
              <p className="font-bold text-sm">Erro ao carregar agenda</p>
              <p className="text-xs opacity-80">Não foi possível conectar ao banco de dados ou a tabela não existe.</p>
            </div>
          </div>
        )}

        {/* Progress Card */}
        <div className="bg-white p-6 rounded-3xl shadow-premium border border-border flex items-center gap-8 animate-in slide-in-from-top duration-500">
          <div className="relative w-20 h-20 shrink-0">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-muted/30" />
              <circle 
                cx="40" 
                cy="40" 
                r="36" 
                stroke="currentColor" 
                strokeWidth="8" 
                fill="transparent" 
                className="text-accent transition-all duration-700 ease-out" 
                strokeDasharray={`${2 * Math.PI * 36}`} 
                strokeDashoffset={`${2 * Math.PI * 36 * (1 - progressPercent / 100)}`} 
                strokeLinecap="round" 
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center font-black text-primary text-sm">
              {Math.round(progressPercent)}%
            </div>
          </div>
          
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-1">Status da Agenda</h3>
            <p className="text-sm text-muted-foreground font-medium">
              {tasks.length > 0 
                ? `Você completou ${completedCount} de ${tasks.length} atividades hoje.`
                : 'Sua agenda está limpa. Que tal planejar seu dia?'
              }
            </p>
            <div className="mt-4 flex gap-4">
              <div className="flex items-center gap-1.5 text-xs font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-100">
                <CheckCircle2 size={14} /> {completedCount} Concluídas
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-accent bg-accent/5 px-3 py-1 rounded-full border border-accent/10">
                <Clock size={14} /> {tasks.length - completedCount} Pendentes
              </div>
            </div>
          </div>
        </div>

        {/* Agenda List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="font-bold text-primary flex items-center gap-2 uppercase tracking-widest text-[10px]">
              <CalendarIcon size={16} /> Próximos Compromissos
            </h3>
            <button onClick={refresh} className="text-[10px] font-black text-primary/50 hover:text-primary transition-colors flex items-center gap-1 uppercase tracking-widest">
              <RefreshCw size={12} className={loading ? 'animate-spin' : ''} /> Sincronizar
            </button>
          </div>

          <div className="grid gap-4">
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <div 
                  key={task.id} 
                  className={`group flex items-center gap-6 p-5 rounded-[2rem] border transition-all ${
                    task.completed 
                    ? 'bg-muted/30 border-transparent opacity-60' 
                    : 'bg-white border-border hover:shadow-luxury hover:scale-[1.01]'
                  }`}
                >
                  <button 
                    onClick={() => toggleTask(task.id, task.completed)}
                    className={`shrink-0 transition-colors ${task.completed ? 'text-green-500' : 'text-muted-foreground hover:text-primary'}`}
                  >
                    {task.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {getCategoryIcon(task.category)}
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        {task.category === 'business' ? 'Negócios' : task.category === 'personal' ? 'Pessoal' : task.category}
                      </span>
                      {task.leads && (
                        <span className="bg-primary/5 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full border border-primary/10">
                          {task.leads.name}
                        </span>
                      )}
                    </div>
                    <h4 className={`font-bold text-primary truncate ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                      {task.title}
                    </h4>
                    {task.description && <p className="text-xs text-muted-foreground truncate font-medium">{task.description}</p>}
                  </div>

                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <div className="text-sm font-black text-primary flex items-center gap-1">
                      <Clock size={14} />
                      {new Date(task.due_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                      {new Date(task.due_date).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => deleteTask(task.id)}
                      className="p-2 text-muted-foreground hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={18} />
                    </button>
                    <button className="p-2 text-muted-foreground hover:text-primary transition-colors">
                      <MoreVertical size={18} />
                    </button>
                  </div>
                </div>
              ))
            ) : !loading && (
              <div className="py-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-border animate-pulse">
                <p className="text-muted-foreground font-medium">Sua agenda está livre por enquanto.</p>
              </div>
            )}
          </div>
        </div>

        {/* Intelligence Tip */}
        <div className="bg-primary text-white p-8 rounded-[2.5rem] shadow-luxury flex items-start gap-6 border border-white/10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-1000" />
          <div className="p-4 bg-white/10 rounded-2xl text-accent group-hover:rotate-12 transition-transform">
            <AlertCircle size={32} />
          </div>
          <div className="relative z-10">
            <h4 className="font-black text-xl mb-2 uppercase tracking-tight">Dica de Performance</h4>
            <p className="text-sm text-white/70 leading-relaxed font-medium">
              Conciliar compromissos <span className="text-accent font-bold">pessoais</span> e <span className="text-accent font-bold">profissionais</span> em um único lugar reduz o stress cognitivo e aumenta sua produtividade em até <span className="text-white font-bold">35%</span>. Mantenha sua agenda atualizada!
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
