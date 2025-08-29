import { useEffect } from 'react';
import { useTasksStore } from '@/src/store/tasks.store';

export const useTasks = () => {
  const store = useTasksStore();

  useEffect(() => {
    store.loadTasks();
  }, []);

  return store;
};