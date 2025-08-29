import { Task, Session } from '@/src/types';
import { generateId } from './uuid';

export const createSeedTasks = (): Task[] => [
  {
    id: generateId(),
    title: 'Estudar React Native',
    description: 'Revisar conceitos de navegação e estado',
    priority: 'high',
    tags: ['estudo', 'programação'],
    done: false,
    pomodoros: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    title: 'Ler artigo sobre Zustand',
    description: 'Entender melhor o gerenciamento de estado',
    priority: 'medium',
    tags: ['leitura', 'programação'],
    done: false,
    pomodoros: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    title: 'Fazer exercícios',
    description: 'Treino de força e cardio',
    priority: 'high',
    tags: ['saúde', 'exercício'],
    done: true,
    pomodoros: 2,
    createdAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    updatedAt: new Date().toISOString(),
  },
];

export const createSeedSessions = (): Session[] => {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  return [
    {
      id: generateId(),
      type: 'focus',
      durationSec: 1500, // 25 min
      startedAt: new Date(todayStart.getTime() + 8 * 60 * 60 * 1000).toISOString(), // 8 AM today
      endedAt: new Date(todayStart.getTime() + 8 * 60 * 60 * 1000 + 1500 * 1000).toISOString(),
      taskId: undefined,
    },
    {
      id: generateId(),
      type: 'shortBreak',
      durationSec: 300, // 5 min
      startedAt: new Date(todayStart.getTime() + 8.5 * 60 * 60 * 1000).toISOString(),
      endedAt: new Date(todayStart.getTime() + 8.5 * 60 * 60 * 1000 + 300 * 1000).toISOString(),
    },
    {
      id: generateId(),
      type: 'focus',
      durationSec: 1500,
      startedAt: new Date(todayStart.getTime() + 9 * 60 * 60 * 1000).toISOString(),
      endedAt: new Date(todayStart.getTime() + 9 * 60 * 60 * 1000 + 1500 * 1000).toISOString(),
      taskId: undefined,
    },
  ];
};