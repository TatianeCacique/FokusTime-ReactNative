import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView,
  Alert
} from 'react-native';
import { Share, Calendar, Clock, Target, BarChart3 } from 'lucide-react-native';
import * as Sharing from 'expo-sharing';
import { useSessionsStore } from '@/src/store/sessions.store';
import { useTasksStore } from '@/src/store/tasks.store';
import { useSettingsStore } from '@/src/store/settings.store';
import { formatTime, formatDateTime, isToday, isThisWeek } from '@/src/utils/time';
import { EmptyState } from '@/src/components/EmptyState';
import { t } from '@/src/i18n';
import { Session } from '@/src/types';

type FilterType = 'today' | 'thisWeek' | 'thisMonth' | 'all';

export default function HistoryScreen() {
  const [filter, setFilter] = useState<FilterType>('today');
  const { sessions, loadSessions } = useSessionsStore();
  const { tasks } = useTasksStore();
  const { settings } = useSettingsStore();

  useEffect(() => {
    loadSessions();
  }, []);

  const getFilteredSessions = (): Session[] => {
    const now = new Date();
    
    return sessions.filter(session => {
      const sessionDate = new Date(session.endedAt);
      
      switch (filter) {
        case 'today':
          return isToday(session.endedAt);
        case 'thisWeek':
          return isThisWeek(session.endedAt);
        case 'thisMonth':
          return (
            sessionDate.getMonth() === now.getMonth() &&
            sessionDate.getFullYear() === now.getFullYear()
          );
        case 'all':
        default:
          return true;
      }
    });
  };

  const filteredSessions = getFilteredSessions();
  const focusSessions = filteredSessions.filter(s => s.type === 'focus');
  const totalFocusTime = focusSessions.reduce((total, session) => total + session.durationSec, 0);
  const completedTasks = tasks.filter(task => task.done).length;

  const exportData = async () => {
    try {
      const exportData = {
        sessions: filteredSessions,
        tasks,
        settings,
        exportedAt: new Date().toISOString(),
      };

      const jsonData = JSON.stringify(exportData, null, 2);
      const fileName = `pomodoro-export-${new Date().toISOString().split('T')[0]}.json`;
      
      // In a real app, you would save to file system and share
      Alert.alert(
        t('export', settings.locale),
        'Dados exportados com sucesso! (Feature completa requer configuração de file system)',
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível exportar os dados.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('history', settings.locale)}</Text>
        
        <TouchableOpacity
          style={styles.exportButton}
          onPress={exportData}
          accessibilityLabel={t('export', settings.locale)}
          accessibilityRole="button"
        >
          <Share size={20} color="#DC2626" />
          <Text style={styles.exportText}>{t('export', settings.locale)}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Filter Buttons */}
        <View style={styles.filterContainer}>
          {(['today', 'thisWeek', 'thisMonth', 'all'] as FilterType[]).map((f) => (
            <TouchableOpacity
              key={f}
              style={[
                styles.filterButton,
                filter === f && styles.filterButtonActive
              ]}
              onPress={() => setFilter(f)}
              accessibilityLabel={t(f, settings.locale)}
              accessibilityRole="button"
            >
              <Text style={[
                styles.filterButtonText,
                filter === f && styles.filterButtonTextActive
              ]}>
                {t(f, settings.locale)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Insights */}
        <View style={styles.insightsContainer}>
          <Text style={styles.sectionTitle}>{t('insights', settings.locale)}</Text>
          
          <View style={styles.insightsGrid}>
            <View style={styles.insightCard}>
              <Clock size={24} color="#DC2626" />
              <Text style={styles.insightValue}>{formatTime(totalFocusTime)}</Text>
              <Text style={styles.insightLabel}>{t('totalFocusToday', settings.locale)}</Text>
            </View>

            <View style={styles.insightCard}>
              <Target size={24} color="#16A34A" />
              <Text style={styles.insightValue}>{focusSessions.length}</Text>
              <Text style={styles.insightLabel}>{t('focusSessionsToday', settings.locale)}</Text>
            </View>

            <View style={styles.insightCard}>
              <Calendar size={24} color="#2563EB" />
              <Text style={styles.insightValue}>{completedTasks}</Text>
              <Text style={styles.insightLabel}>{t('tasksCompleted', settings.locale)}</Text>
            </View>
          </View>
        </View>

        {/* Sessions List */}
        <View style={styles.sessionsContainer}>
          <Text style={styles.sectionTitle}>Sessões</Text>
          
          {filteredSessions.length === 0 ? (
            <EmptyState
              title={t('noSessions', settings.locale)}
              description="Comece um timer para ver suas sessões aqui."
              icon={<BarChart3 size={48} color="#E5E7EB" />}
            />
          ) : (
            filteredSessions.reverse().map((session) => (
              <SessionItem
                key={session.id}
                session={session}
                task={tasks.find(t => t.id === session.taskId)}
                locale={settings.locale}
              />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

interface SessionItemProps {
  session: Session;
  task?: any;
  locale: string;
}

const SessionItem: React.FC<SessionItemProps> = ({ session, task, locale }) => {
  const typeColors = {
    focus: '#DC2626',
    shortBreak: '#16A34A',
    longBreak: '#2563EB',
  };

  return (
    <View style={styles.sessionItem}>
      <View style={[styles.sessionType, { backgroundColor: typeColors[session.type] }]}>
        <Text style={styles.sessionTypeText}>
          {t(session.type, locale).charAt(0)}
        </Text>
      </View>

      <View style={styles.sessionContent}>
        <Text style={styles.sessionTitle}>
          {t(session.type, locale)}
        </Text>
        
        {task && (
          <Text style={styles.sessionTask}>{task.title}</Text>
        )}
        
        <Text style={styles.sessionTime}>
          {formatTime(session.durationSec)} • {formatDateTime(session.endedAt, locale)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderColor: '#E5E7EB',
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
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DC2626',
  },
  exportText: {
    color: '#DC2626',
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 8,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: '#DC2626',
    borderColor: '#DC2626',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: 'white',
  },
  insightsContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  insightsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  insightCard: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  insightValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 8,
    marginBottom: 4,
  },
  insightLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  sessionsContainer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  sessionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    gap: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  sessionType: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sessionTypeText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  sessionContent: {
    flex: 1,
  },
  sessionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  sessionTask: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  sessionTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});