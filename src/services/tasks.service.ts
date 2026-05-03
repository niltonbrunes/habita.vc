import { supabase } from '@/lib/supabase';
import { Task } from '@/types/database';

export const TasksService = {
  async getAll() {
    const { data, error } = await supabase
      .from('tasks')
      .select('*, leads(name)')
      .order('due_date', { ascending: true });

    if (error) throw error;
    return data as (Task & { leads?: { name: string } })[];
  },

  async getByUser(userId: string) {
    const { data, error } = await supabase
      .from('tasks')
      .select('*, leads(name)')
      .eq('user_id', userId)
      .order('due_date', { ascending: true });

    if (error) throw error;
    return data as (Task & { leads?: { name: string } })[];
  },

  async create(task: Partial<Task>) {
    const { data, error } = await supabase
      .from('tasks')
      .insert(task)
      .select()
      .single();

    if (error) throw error;
    return data as Task;
  },

  async update(id: string, updates: Partial<Task>) {
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Task;
  },

  async toggleComplete(id: string, currentStatus: boolean) {
    const { data, error } = await supabase
      .from('tasks')
      .update({ 
        completed: !currentStatus,
        completed_at: !currentStatus ? new Date().toISOString() : null
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Task;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};
