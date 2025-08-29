import { create } from 'zustand';
import { Settings } from '@/src/types';
import { StorageService } from '@/src/services/storage';
import { DEFAULT_SETTINGS } from '@/src/utils/constants';

interface SettingsStore {
  settings: Settings;
  loadSettings: () => Promise<void>;
  updateSettings: (settings: Partial<Settings>) => Promise<void>;
  resetSettings: () => Promise<void>;
}

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  settings: DEFAULT_SETTINGS,

  loadSettings: async () => {
    const settings = await StorageService.getSettings();
    set({ settings });
  },

  updateSettings: async (newSettings) => {
    const currentSettings = get().settings;
    const updatedSettings = { ...currentSettings, ...newSettings };
    
    await StorageService.saveSettings(updatedSettings);
    set({ settings: updatedSettings });
  },

  resetSettings: async () => {
    await StorageService.saveSettings(DEFAULT_SETTINGS);
    set({ settings: DEFAULT_SETTINGS });
  },
}));