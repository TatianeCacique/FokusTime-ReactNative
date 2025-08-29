import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView,
  Switch,
  TextInput,
  Alert
} from 'react-native';
import { useSettingsStore } from '@/src/store/settings.store';
import { StorageService } from '@/src/services/storage';
import { t } from '@/src/i18n';
import { useAuth } from '@/src/hooks/useAuth';
import { useRouter } from 'expo-router';

export default function SettingsScreen() {
  const { settings, updateSettings, resetSettings } = useSettingsStore();
  const [localSettings, setLocalSettings] = useState(settings);
  const { signOut } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleSave = async () => {
    await updateSettings(localSettings);
    Alert.alert('Sucesso', 'Configurações salvas com sucesso!');
  };

  const handleResetData = () => {
    Alert.alert(
      t('resetData', settings.locale),
      t('resetDataConfirm', settings.locale),
      [
        { text: t('no', settings.locale), style: 'cancel' },
        { 
          text: t('yes', settings.locale), 
          style: 'destructive',
          onPress: async () => {
            await StorageService.clearAllData();
            await resetSettings();
            Alert.alert('Sucesso', 'Dados resetados com sucesso!');
          }
        },
      ]
    );
  };

  const updateLocalSetting = (key: keyof typeof localSettings, value: any) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('settings', settings.locale)}</Text>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          accessibilityLabel={t('save', settings.locale)}
          accessibilityRole="button"
        >
          <Text style={styles.saveButtonText}>{t('save', settings.locale)}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Timer Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('timerSettings', settings.locale)}</Text>
          
          <SettingItem
            label={t('focusDuration', settings.locale)}
            value={localSettings.focusMin.toString()}
            onChangeText={(text) => {
              const value = parseInt(text) || 0;
              if (value > 0) updateLocalSetting('focusMin', value);
            }}
            keyboardType="numeric"
          />

          <SettingItem
            label={t('shortBreakDuration', settings.locale)}
            value={localSettings.shortBreakMin.toString()}
            onChangeText={(text) => {
              const value = parseInt(text) || 0;
              if (value > 0) updateLocalSetting('shortBreakMin', value);
            }}
            keyboardType="numeric"
          />

          <SettingItem
            label={t('longBreakDuration', settings.locale)}
            value={localSettings.longBreakMin.toString()}
            onChangeText={(text) => {
              const value = parseInt(text) || 0;
              if (value > 0) updateLocalSetting('longBreakMin', value);
            }}
            keyboardType="numeric"
          />

          <SettingItem
            label={t('cyclesUntilLongBreak', settings.locale)}
            value={localSettings.cyclesUntilLongBreak.toString()}
            onChangeText={(text) => {
              const value = parseInt(text) || 0;
              if (value > 0) updateLocalSetting('cyclesUntilLongBreak', value);
            }}
            keyboardType="numeric"
          />
        </View>

        {/* Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('notifications', settings.locale)}</Text>
          
          <SettingSwitch
            label={t('sound', settings.locale)}
            value={localSettings.sound}
            onValueChange={(value) => updateLocalSetting('sound', value)}
          />

          <SettingSwitch
            label={t('vibration', settings.locale)}
            value={localSettings.vibration}
            onValueChange={(value) => updateLocalSetting('vibration', value)}
          />
        </View>

        {/* Appearance */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('appearance', settings.locale)}</Text>
          
          <SettingPicker
            label={t('theme', settings.locale)}
            value={localSettings.theme}
            options={[
              { value: 'system', label: t('system', settings.locale) },
              { value: 'light', label: t('light', settings.locale) },
              { value: 'dark', label: t('dark', settings.locale) },
            ]}
            onValueChange={(value) => updateLocalSetting('theme', value)}
          />

          <SettingPicker
            label={t('language', settings.locale)}
            value={localSettings.locale}
            options={[
              { value: 'pt-BR', label: 'Português' },
              { value: 'en-US', label: 'English' },
            ]}
            onValueChange={(value) => updateLocalSetting('locale', value)}
          />
        </View>

        {/* Data Management */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('dataManagement', settings.locale)}</Text>
          {/* Botão de editar dados */}
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => router.replace('/AlterarDados')}
            accessibilityLabel="Editar dados do usuário"
            accessibilityRole="button"
          >
            <Text style={styles.editButtonText}>Editar dados</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.dangerButton}
            onPress={handleResetData}
            accessibilityLabel={t('resetData', settings.locale)}
            accessibilityRole="button"
          >
            <Text style={styles.dangerButtonText}>{t('resetData', settings.locale)}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={signOut}
            accessibilityLabel="Sair da conta"
            accessibilityRole="button"
          >
            <Text style={styles.logoutButtonText}>Sair</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

interface SettingItemProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: 'default' | 'numeric';
}

const SettingItem: React.FC<SettingItemProps> = ({ label, value, onChangeText, keyboardType = 'default' }) => (
  <View style={styles.settingItem}>
    <Text style={styles.settingLabel}>{label}</Text>
    <TextInput
      style={styles.settingInput}
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      accessibilityLabel={label}
    />
  </View>
);

interface SettingSwitchProps {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}

const SettingSwitch: React.FC<SettingSwitchProps> = ({ label, value, onValueChange }) => (
  <View style={styles.settingItem}>
    <Text style={styles.settingLabel}>{label}</Text>
    <Switch
      value={value}
      onValueChange={onValueChange}
      trackColor={{ false: '#E5E7EB', true: '#DC262680' }}
      thumbColor={value ? '#DC2626' : '#F9FAFB'}
      accessibilityLabel={label}
    />
  </View>
);

interface SettingPickerProps {
  label: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  onValueChange: (value: string) => void;
}

const SettingPicker: React.FC<SettingPickerProps> = ({ label, value, options, onValueChange }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  return (
    <>
      <TouchableOpacity
        style={styles.settingItem}
        onPress={() => setIsModalVisible(true)}
        accessibilityLabel={label}
        accessibilityRole="button"
      >
        <Text style={styles.settingLabel}>{label}</Text>
        <Text style={styles.settingValue}>
          {options.find(opt => opt.value === value)?.label || value}
        </Text>
      </TouchableOpacity>

      {/* Simple picker modal would go here in a real implementation */}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
  },
  saveButton: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  settingLabel: {
    fontSize: 16,
    color: '#374151',
    flex: 1,
  },
  settingInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    minWidth: 80,
    textAlign: 'center',
  },
  settingValue: {
    fontSize: 16,
    color: '#6B7280',
  },
  dangerButton: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  dangerButtonText: {
    color: '#DC2626',
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#E0F7FA',
    borderWidth: 1,
    borderColor: '#B2EBF2',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  logoutButtonText: {
    color: '#00796B',
    fontSize: 16,
    fontWeight: '600',
  },
  editButton: {
    backgroundColor: '#E8F5E9',
    borderWidth: 1,
    borderColor: '#C8E6C9',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  editButtonText: {
    color: '#2E7D32',
    fontSize: 16,
    fontWeight: '600',
  },
});