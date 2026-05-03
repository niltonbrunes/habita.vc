'use client';

import { useState, useEffect, useCallback } from 'react';
import { TasksService } from '@/services/tasks.service';
import { Task } from '@/types/database';
import { useAuth } from '@/context/AuthContext';

export function useTasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<(Task & { leads?: { name: string } })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await TasksService.getAll();
      setTasks(data);
    } catch (err) {
      console.error('Erro ao carregar tarefas:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

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
    error,
    refresh: fetchTasks,
    toggleTask,
    deleteTask
  };
}
