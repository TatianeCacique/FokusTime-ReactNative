import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet } from 'react-native';
import { ChevronDown, Check } from 'lucide-react-native';
import { useTasks } from '@/src/hooks/useTasks';
import { useTimerStore } from '@/src/store/timer.store';
import { useSettingsStore } from '@/src/store/settings.store';
import { t } from '@/src/i18n';

export const TaskSelector: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { tasks } = useTasks();
  const { currentTaskId, setCurrentTask } = useTimerStore();
  const { settings } = useSettingsStore();

  const activeTasks = tasks.filter(task => !task.done);
  const selectedTask = activeTasks.find(task => task.id === currentTaskId);

  const handleSelectTask = (taskId: string | undefined) => {
    setCurrentTask(taskId);
    setIsModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{t('selectTask', settings.locale)}</Text>
      
      <TouchableOpacity
        style={styles.selector}
        onPress={() => setIsModalVisible(true)}
        accessibilityLabel={t('selectTask', settings.locale)}
        accessibilityRole="button"
        testID="task-selector"
      >
        <Text style={styles.selectedText}>
          {selectedTask ? selectedTask.title : t('noTaskSelected', settings.locale)}
        </Text>
        <ChevronDown size={20} color="#6B7280" />
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t('selectTask', settings.locale)}</Text>
            
            <FlatList
              data={[{ id: undefined, title: t('noTaskSelected', settings.locale) }, ...activeTasks]}
              keyExtractor={(item) => item.id || 'none'}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.taskOption}
                  onPress={() => handleSelectTask(item.id)}
                  testID={`task-option-${item.id || 'none'}`}
                >
                  <Text style={styles.taskTitle}>{item.title}</Text>
                  {currentTaskId === item.id && (
                    <Check size={20} color="#16A34A" />
                  )}
                </TouchableOpacity>
              )}
              style={styles.taskList}
            />

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={styles.cancelText}>{t('cancel', settings.locale)}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#374151',
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  selectedText: {
    fontSize: 16,
    color: '#374151',
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    width: '90%',
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  taskList: {
    maxHeight: 300,
  },
  taskOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  taskTitle: {
    fontSize: 16,
    flex: 1,
  },
  cancelButton: {
    marginTop: 16,
    padding: 12,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    color: '#6B7280',
  },
});