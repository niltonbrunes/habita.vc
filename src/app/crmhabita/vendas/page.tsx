'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SalesService } from '@/services/sales.service';
import { useAuth } from '@/context/AuthContext';
import { SaleModal } from '@/components/leads/SaleModal';
import {
  DollarSign,
  Pencil,
  Trash2,
  Plus,
  Search,
  TrendingUp,
  Loader2,
  AlertTriangle,
  X,
  Building2,
  User,
  Calendar,
  Percent,
} from 'lucide-react';

export default function VendasPage() {
  const { user, profile } = useAuth();
  const [sales, setSales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const [editingSale, setEditingSale] = useState<any | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadSales = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await SalesService.getAllFull();
      setSales(data);
    } catch (err: any) {
      setError('Erro ao carregar vendas: ' + err?.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSales();
  }, [loadSales]);

  const handleDelete = async (sale: any) => {
    try {
      setDeletingId(sale.id);
      await SalesService.delete(sale.id);
      setConfirmDelete(null);
      await loadSales();
    } catch (err: any) {
      setError('Erro ao excluir venda: ' + err?.message);
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = sales.filter(s => {
    const q = search.toLowerCase();
    return (
      (s.leads?.name || '').toLowerCase().includes(q) ||
      (s.properties?.title || '').toLowerCase().includes(q) ||
      (s.profiles?.full_name || '').toLowerCase().includes(q)
    );
  });

  const totalRevenue = sales.reduce((acc, s) => acc + (Number(s.sale_price) || 0), 0);
  const totalCommission = sales.reduce((acc, s) => acc + (Number(s.broker_commission) || 0), 0);
  const avgTicket = sales.length > 0 ? totalRevenue / sales.length : 0;

  const formatCurrency = (v: number) => {
    if (!v || isNaN(v)) return 'R$ 0';
    if (v >= 1_000_000) return `R$ ${(v / 1_000_000).toFixed(2)}M`;
    if (v >= 1_000) return `R$ ${(v / 1_000).toFixed(0)}k`;
    return `R$ ${v.toLocaleString('pt-BR')}`;
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8 pb-16">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-primary tracking-tighter mb-1">Gestao de Vendas</h1>
            <p className="text-muted-foreground font-medium">Historico completo, edicao e exclusao de vendas.</p>
          </div>
          <button
            onClick={() => { setEditingSale(null); setIsSaleModalOpen(true); }}
            className="flex items-center gap-2 bg-blue-primary text-white px-6 py-3 rounded-2xl font-black hover:bg-blue-primary-light transition-all shadow-card"
          >
            <Plus size={20} /> Nova Venda
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-surface p-6 rounded-[1.5rem] shadow-card border border-border flex items-center gap-4">
            <div className="p-3 rounded-2xl shrink-0 text-green-600 bg-green-50">
              <DollarSign size={22} />
            </div>
            <div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Volume Total</p>
              <p className="text-xl font-bold text-heading">{formatCurrency(totalRevenue)}</p>
            </div>
          </div>
          <div className="bg-surface p-6 rounded-[1.5rem] shadow-card border border-border flex items-center gap-4">
            <div className="p-3 rounded-2xl shrink-0 text-blue-600 bg-blue-50">
              <Percent size={22} />
            </div>
            <div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Comissao Acumulada</p>
              <p className="text-xl font-bold text-heading">{formatCurrency(totalCommission)}</p>
            </div>
          </div>
          <div className="bg-surface p-6 rounded-[1.5rem] shadow-card border border-border flex items-center gap-4">
            <div className="p-3 rounded-2xl shrink-0 text-purple-600 bg-purple-50">
              <TrendingUp size={22} />
            </div>
            <div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Ticket Medio</p>
              <p className="text-xl font-bold text-heading">{formatCurrency(avgTicket)}</p>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl flex items-center gap-3">
            <AlertTriangle size={18} />
            <span className="text-sm font-bold">{error}</span>
            <button onClick={() => setError(null)} className="ml-auto"><X size={16} /></button>
          </div>
        )}

        {/* Table */}
        <div className="bg-surface rounded-xl shadow-card border border-border overflow-hidden">
          <div className="p-6 border-b border-border flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar cliente, imovel ou corretor..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-muted/50 border border-transparent rounded-xl focus:border-primary/20 focus:outline-none text-sm font-medium"
              />
            </div>
            <span className="text-sm text-muted-foreground font-medium">{filtered.length} venda(s)</span>
          </div>

          {loading ? (
            <div className="p-20 flex flex-col items-center gap-4">
              <Loader2 className="animate-spin text-primary" size={36} />
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Carregando vendas...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-16 text-center">
              <DollarSign size={40} className="mx-auto text-muted-foreground/30 mb-4" />
              <p className="font-bold text-muted-foreground">Nenhuma venda encontrada.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/20">
                    <th className="text-left px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Cliente</th>
                    <th className="text-left px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Imovel</th>
                    <th className="text-left px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Corretor</th>
                    <th className="text-right px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Valor Venda</th>
                    <th className="text-right px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Minha Comissao</th>
                    <th className="text-center px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Data</th>
                    <th className="text-center px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Acoes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map(sale => (
                    <tr key={sale.id} className="hover:bg-muted/20 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-blue-primary/10 rounded-xl flex items-center justify-center shrink-0">
                            <User size={16} className="text-primary" />
                          </div>
                          <span className="font-bold text-primary text-sm">{sale.leads?.name || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Building2 size={14} className="text-muted-foreground shrink-0" />
                          <span className="text-sm font-medium text-muted-foreground">{sale.properties?.title || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-muted-foreground">{sale.profiles?.full_name || 'N/A'}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="font-black text-primary">
                          {sale.sale_price > 0
                            ? `R$ ${Number(sale.sale_price).toLocaleString('pt-BR')}`
                            : <span className="text-muted-foreground text-xs font-bold">Nao informado</span>}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div>
                          <p className="font-black text-green-600 text-sm">
                            {sale.broker_commission > 0
                              ? `R$ ${Number(sale.broker_commission).toLocaleString('pt-BR')}`
                              : <span className="text-muted-foreground">N/A</span>}
                          </p>
                          {sale.split_metadata?.broker_percent > 0 && (
                            <p className="text-[10px] text-muted-foreground font-bold">{sale.split_metadata.broker_percent}% split</p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground font-medium">
                          <Calendar size={12} />
                          {sale.sale_date ? new Date(sale.sale_date).toLocaleDateString('pt-BR') : 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          {(sale.broker_id === user?.id || ['admin', 'manager', 'director'].includes(profile?.role || '')) && (
                            <>
                              <button
                            onClick={() => { setEditingSale(sale); setIsSaleModalOpen(true); }}
                            className="p-2 rounded-xl bg-blue-primary/10 text-primary hover:bg-blue-primary hover:text-white transition-all"
                            title="Editar venda"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            onClick={() => setConfirmDelete(sale)}
                            className="p-2 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                            title="Excluir venda"
                          >
                            <Trash2 size={15} />
                          </button>
                            </>
                          )}
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

      {/* Confirm Delete Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-blue-primary/40 backdrop-blur-md" onClick={() => setConfirmDelete(null)} />
          <div className="relative bg-surface rounded-xl shadow-card border border-border p-8 max-w-md w-full animate-in fade-in zoom-in duration-200">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 size={28} className="text-red-500" />
              </div>
              <div>
                <h3 className="text-xl font-black text-primary mb-1">Excluir Venda?</h3>
                <p className="text-sm text-muted-foreground">
                  Tem certeza que deseja excluir a venda de{' '}
                  <strong>{confirmDelete.leads?.name || 'este cliente'}</strong>?
                  Esta acao nao pode ser desfeita.
                </p>
              </div>
              {error && <p className="text-red-600 text-xs font-bold">{error}</p>}
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => { setConfirmDelete(null); setError(null); }}
                  className="flex-1 py-3 rounded-2xl border border-border font-bold text-muted-foreground hover:bg-muted transition-all"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleDelete(confirmDelete)}
                  disabled={deletingId === confirmDelete.id}
                  className="flex-1 py-3 rounded-2xl bg-red-500 text-white font-black hover:bg-red-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {deletingId === confirmDelete.id ? <Loader2 className="animate-spin" size={18} /> : <Trash2 size={18} />}
                  Excluir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sale Modal */}
      {isSaleModalOpen && (
        <SaleModal
          isOpen={isSaleModalOpen}
          onClose={() => { setIsSaleModalOpen(false); setEditingSale(null); }}
          onSuccess={() => { setIsSaleModalOpen(false); setEditingSale(null); loadSales(); }}
          initialData={editingSale ? {
            sale_price: editingSale.sale_price,
            total_commission_percent: editingSale.split_metadata?.total_percent || 5,
            broker_split_percent: editingSale.split_metadata?.broker_percent || 50,
          } : undefined}
        />
      )}
    </DashboardLayout>
  );
}
