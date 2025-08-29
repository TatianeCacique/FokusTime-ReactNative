import { create } from 'zustand';
import { Task } from '@/src/types';
import { StorageService } from '@/src/services/storage';
import { generateId } from '@/src/utils/uuid';

interface TasksStore {
  tasks: Task[];
  loadTasks: () => Promise<void>;
  addTask: (task: Omit<Task, 'id' | 'pomodoros' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  incrementPomodoros: (id: string) => Promise<void>;
  getActiveTask: (id: string) => Task | undefined;
}

export const useTasksStore = create<TasksStore>((set, get) => ({
  tasks: [],

  loadTasks: async () => {
    const tasks = await StorageService.getTasks();
    set({ tasks });
  },

  addTask: async (taskData) => {
    const newTask: Task = {
      ...taskData,
      id: generateId(),
      pomodoros: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const tasks = [...get().tasks, newTask];
    await StorageService.saveTasks(tasks);
    set({ tasks });
  },

  updateTask: async (id, updates) => {
    const tasks = get().tasks.map(task =>
      task.id === id
        ? { ...task, ...updates, updatedAt: new Date().toISOString() }
        : task
    );

    await StorageService.saveTasks(tasks);
    set({ tasks });
  },

  deleteTask: async (id) => {
    const tasks = get().tasks.filter(task => task.id !== id);
    await StorageService.saveTasks(tasks);
    set({ tasks });
  },

  incrementPomodoros: async (id) => {
    const tasks = get().tasks.map(task =>
      task.id === id
        ? { ...task, pomodoros: task.pomodoros + 1, updatedAt: new Date().toISOString() }
        : task
    );

    await StorageService.saveTasks(tasks);
    set({ tasks });
  },

  getActiveTask: (id) => {
    return get().tasks.find(task => task.id === id && !task.done);
  },
}));