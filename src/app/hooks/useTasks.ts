import { useEffect } from 'react';
import { useTasksStore } from '@/src/app/context/tasks.store';

export const useTasks = () => {
  const store = useTasksStore();

  useEffect(() => {
    store.loadTasks();
  }, []);

  return store;
};
