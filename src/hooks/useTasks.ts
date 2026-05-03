'use client';

import { useState, useEffect, useCallback } from 'react';
import { TasksService } from '@/services/tasks.service';
import { Task } from '@/types/database';
import { useAuth } from '@/context/AuthContext';

export function useTasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<(Task & { leads?: { name: string } })[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await TasksService.getByUser(user.id);
      setTasks(data);
    } catch (error) {
      console.error('Erro ao buscar tarefas:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const toggleTask = async (id: string, currentStatus: boolean) => {
    try {
      await TasksService.toggleComplete(id, currentStatus);
      await fetchTasks();
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await TasksService.delete(id);
      await fetchTasks();
    } catch (error) {
      console.error('Erro ao excluir tarefa:', error);
    }
  };

  return {
    tasks,
    loading,
    refresh: fetchTasks,
    toggleTask,
    deleteTask
  };
}
