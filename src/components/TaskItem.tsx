import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Edit3, Trash2, Check, Clock } from 'lucide-react-native';
import { Task } from '@/src/types';
import { PRIORITY_COLORS } from '@/src/utils/constants';
import { useSettingsStore } from '@/src/store/settings.store';
import { t } from '@/src/i18n';

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({ 
  task, 
  onEdit, 
  onDelete, 
  onToggleComplete 
}) => {
  const { settings } = useSettingsStore();

  return (
    <View style={[styles.container, task.done && styles.completedContainer]}>
      <TouchableOpacity
        style={styles.completeButton}
        onPress={() => onToggleComplete(task.id)}
        accessibilityLabel={task.done ? t('incomplete', settings.locale) : t('complete', settings.locale)}
        accessibilityRole="button"
        testID={`task-complete-${task.id}`}
      >
        <View style={[
          styles.checkbox,
          task.done && styles.checkedBox,
          { borderColor: PRIORITY_COLORS[task.priority] }
        ]}>
          {task.done && <Check size={16} color="white" />}
        </View>
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={[styles.title, task.done && styles.completedText]}>
          {task.title}
        </Text>
        
        {task.description && (
          <Text style={[styles.description, task.done && styles.completedText]}>
            {task.description}
          </Text>
        )}

        <View style={styles.metadata}>
          <View style={[styles.priorityBadge, { backgroundColor: PRIORITY_COLORS[task.priority] }]}>
            <Text style={styles.priorityText}>{t(task.priority, settings.locale)}</Text>
          </View>

          <View style={styles.pomodoroCount}>
            <Clock size={14} color="#6B7280" />
            <Text style={styles.pomodoroText}>
              {task.pomodoros} {t('pomodoros', settings.locale)}
            </Text>
          </View>
        </View>

        {task.tags.length > 0 && (
          <View style={styles.tags}>
            {task.tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onEdit(task)}
          accessibilityLabel={t('edit', settings.locale)}
          accessibilityRole="button"
          testID={`task-edit-${task.id}`}
        >
          <Edit3 size={18} color="#6B7280" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onDelete(task.id)}
          accessibilityLabel={t('delete', settings.locale)}
          accessibilityRole="button"
          testID={`task-delete-${task.id}`}
        >
          <Trash2 size={18} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  completedContainer: {
    opacity: 0.7,
  },
  completeButton: {
    paddingTop: 2,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkedBox: {
    backgroundColor: '#16A34A',
    borderColor: '#16A34A',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#9CA3AF',
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  metadata: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  priorityText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  pomodoroCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  pomodoroText: {
    fontSize: 12,
    color: '#6B7280',
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 12,
    color: '#6B7280',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
  },
});