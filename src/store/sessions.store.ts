import { create } from 'zustand';
import { Session } from '@/src/types';
import { StorageService } from '@/src/services/storage';
import { generateId } from '@/src/utils/uuid';
import { isToday, isThisWeek } from '@/src/utils/time';

interface SessionsStore {
  sessions: Session[];
  loadSessions: () => Promise<void>;
  addSession: (session: Omit<Session, 'id'>) => Promise<void>;
  getTodaySessions: () => Session[];
  getThisWeekSessions: () => Session[];
  getFocusSessionsToday: () => number;
  getTotalFocusTimeToday: () => number;
  getSessionsByType: (type: Session['type']) => Session[];
}

export const useSessionsStore = create<SessionsStore>((set, get) => ({
  sessions: [],

  loadSessions: async () => {
    const sessions = await StorageService.getSessions();
    set({ sessions });
  },

  addSession: async (sessionData) => {
    const newSession: Session = {
      ...sessionData,
      id: generateId(),
    };

    const sessions = [...get().sessions, newSession];
    await StorageService.saveSessions(sessions);
    set({ sessions });
  },

  getTodaySessions: () => {
    return get().sessions.filter(session => isToday(session.endedAt));
  },

  getThisWeekSessions: () => {
    return get().sessions.filter(session => isThisWeek(session.endedAt));
  },

  getFocusSessionsToday: () => {
    return get().getTodaySessions().filter(session => session.type === 'focus').length;
  },

  getTotalFocusTimeToday: () => {
    return get()
      .getTodaySessions()
      .filter(session => session.type === 'focus')
      .reduce((total, session) => total + session.durationSec, 0);
  },

  getSessionsByType: (type) => {
    return get().sessions.filter(session => session.type === type);
  },
}));