'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { Bell, DollarSign, UserPlus, Zap } from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'sale' | 'lead' | 'system';
  created_at: string;
  read: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, profile } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeToast, setActiveToast] = useState<Notification | null>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    if (!user) return;

    // Listen for NEW LEADS
    const leadsChannel = supabase
      .channel('leads-realtime')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'leads' 
      }, (payload) => {
        const newLead = payload.new as any;
        // If manager or the lead is assigned to the current broker
        if (profile?.role !== 'broker' || newLead.assigned_to_id === user.id) {
          addNotification({
            id: Math.random().toString(),
            title: '🔥 Novo Lead Captado!',
            message: `${newLead.name} acabou de entrar via ${newLead.source || 'Portal'}.`,
            type: 'lead',
            created_at: new Date().toISOString(),
            read: false
          });
        }
      })
      .subscribe();

    // Listen for NEW SALES
    const salesChannel = supabase
      .channel('sales-realtime')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'sales' 
      }, (payload) => {
        const newSale = payload.new as any;
        addNotification({
          id: Math.random().toString(),
          title: '💰 VENDA REALIZADA!',
          message: `Um novo fechamento de R$ ${(newSale.total_price || newSale.sale_price || 0).toLocaleString()} acaba de acontecer!`,
          type: 'sale',
          created_at: new Date().toISOString(),
          read: false
        });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(leadsChannel);
      supabase.removeChannel(salesChannel);
    };
  }, [user, profile]);

  const addNotification = (notif: Notification) => {
    setNotifications(prev => [notif, ...prev]);
    setActiveToast(notif);
    setTimeout(() => setActiveToast(null), 5000);
    
    // Play subtle sound if browser allows
    try { new Audio('/notification.mp3').play().catch(() => {}); } catch(e) {}
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearAll = () => setNotifications([]);

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, clearAll }}>
      {children}
      
      {/* Realtime Toast Notification */}
      {activeToast && (
        <div className="fixed top-6 right-6 z-[200] animate-in slide-in-from-right duration-500">
          <div className={`
            p-6 rounded-[2rem] shadow-luxury border flex items-center gap-4 min-w-[320px] backdrop-blur-xl
            ${activeToast.type === 'sale' ? 'bg-primary text-white border-white/20' : 'bg-white text-primary border-border'}
          `}>
            <div className={`
              p-3 rounded-2xl
              ${activeToast.type === 'sale' ? 'bg-accent text-primary' : 'bg-primary/5 text-primary'}
            `}>
              {activeToast.type === 'sale' ? <DollarSign size={24} /> : <UserPlus size={24} />}
            </div>
            <div>
              <p className="font-black text-sm uppercase tracking-tight">{activeToast.title}</p>
              <p className="text-xs font-medium opacity-70">{activeToast.message}</p>
            </div>
          </div>
        </div>
      )}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotifications must be used within NotificationProvider');
  return context;
};
