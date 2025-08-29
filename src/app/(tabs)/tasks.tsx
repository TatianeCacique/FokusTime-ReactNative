import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  Modal,
  Alert
} from 'react-native';
import { CheckSquare, Plus, Search } from 'lucide-react-native';
import { TaskItem } from '@/src/components/TaskItem';
import { EmptyState } from '@/src/components/EmptyState';
import { useTasks } from '@/src/hooks/useTasks';
import { useSettingsStore } from '@/src/store/settings.store';
import { Task } from '@/src/types';
import { t } from '@/src/i18n';

export default function TasksScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  
  const { tasks, addTask, updateTask, deleteTask } = useTasks();
  const { settings } = useSettingsStore();

  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (task.description?.toLowerCase().includes(searchQuery.toLowerCase())) ||
    task.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setIsModalVisible(true);
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      t('delete', settings.locale),
      t('resetDataConfirm', settings.locale),
      [
        { text: t('no', settings.locale), style: 'cancel' },
        { text: t('yes', settings.locale), onPress: () => deleteTask(id) },
      ]
    );
  };

  const handleToggleComplete = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      updateTask(id, { done: !task.done });
    }
  };

  const openCreateModal = () => {
    setEditingTask(null);
    setIsModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('tasks', settings.locale)}</Text>
        
        <View style={styles.searchContainer}>
          <Search size={20} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder={t('searchTasks', settings.locale)}
            value={searchQuery}
            onChangeText={setSearchQuery}
            accessibilityLabel={t('searchTasks', settings.locale)}
          />
        </View>
      </View>

      {filteredTasks.length === 0 ? (
        <EmptyState
          title={t('noTasks', settings.locale)}
          description={searchQuery ? 'Tente buscar por outros termos.' : 'Comece criando sua primeira tarefa para focar.'}
          actionText={!searchQuery ? t('createFirstTask', settings.locale) : undefined}
          onAction={!searchQuery ? openCreateModal : undefined}
          icon={<CheckSquare size={48} color="#E5E7EB" />}
        />
      ) : (
        <FlatList
          data={filteredTasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TaskItem
              task={item}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleComplete={handleToggleComplete}
            />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={openCreateModal}
        accessibilityLabel={t('newTask', settings.locale)}
        accessibilityRole="button"
        testID="add-task-fab"
      >
        <Plus size={24} color="white" />
      </TouchableOpacity>

      <TaskFormModal
        visible={isModalVisible}
        task={editingTask}
        onClose={() => setIsModalVisible(false)}
        onSave={async (taskData) => {
          if (editingTask) {
            await updateTask(editingTask.id, taskData);
          } else {
            await addTask(taskData);
          }
          setIsModalVisible(false);
        }}
      />
    </SafeAreaView>
  );
}

// Task Form Modal Component
interface TaskFormModalProps {
  visible: boolean;
  task: Task | null;
  onClose: () => void;
  onSave: (task: Omit<Task, 'id' | 'pomodoros' | 'createdAt' | 'updatedAt'>) => void;
}

const TaskFormModal: React.FC<TaskFormModalProps> = ({ visible, task, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [tagsText, setTagsText] = useState('');
  const { settings } = useSettingsStore();

  React.useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setPriority(task.priority);
      setTagsText(task.tags.join(', '));
    } else {
      setTitle('');
      setDescription('');
      setPriority('medium');
      setTagsText('');
    }
  }, [task]);

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('Erro', t('titleRequired', settings.locale));
      return;
    }

    const tags = tagsText
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    onSave({
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      tags,
      done: task?.done || false,
    });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.cancelButton}>{t('cancel', settings.locale)}</Text>
          </TouchableOpacity>
          
          <Text style={styles.modalTitle}>
            {task ? t('editTask', settings.locale) : t('newTask', settings.locale)}
          </Text>
          
          <TouchableOpacity onPress={handleSave}>
            <Text style={styles.saveButton}>{t('save', settings.locale)}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.modalContent}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('title', settings.locale)} *</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder={t('title', settings.locale)}
              accessibilityLabel={t('title', settings.locale)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('description', settings.locale)}</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder={t('description', settings.locale)}
              multiline
              numberOfLines={3}
              accessibilityLabel={t('description', settings.locale)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('priority', settings.locale)}</Text>
            <View style={styles.priorityContainer}>
              {(['low', 'medium', 'high'] as const).map((p) => (
                <TouchableOpacity
                  key={p}
                  style={[
                    styles.priorityButton,
                    priority === p && styles.priorityButtonActive,
                    { borderColor: priority === p ? '#DC2626' : '#E5E7EB' }
                  ]}
                  onPress={() => setPriority(p)}
                  accessibilityLabel={t(p, settings.locale)}
                  accessibilityRole="button"
                >
                  <Text style={[
                    styles.priorityButtonText,
                    priority === p && styles.priorityButtonTextActive
                  ]}>
                    {t(p, settings.locale)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('tags', settings.locale)}</Text>
            <TextInput
              style={styles.input}
              value={tagsText}
              onChangeText={setTagsText}
              placeholder="trabalho, projeto, urgente"
              accessibilityLabel={t('tags', settings.locale)}
            />
            <Text style={styles.hint}>Separe as tags com vírgulas</Text>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  list: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 100,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: '#DC2626',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  cancelButton: {
    fontSize: 16,
    color: '#6B7280',
  },
  saveButton: {
    fontSize: 16,
    color: '#DC2626',
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  priorityContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  priorityButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  priorityButtonActive: {
    backgroundColor: '#DC262610',
  },
  priorityButtonText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  priorityButtonTextActive: {
    color: '#DC2626',
    fontWeight: '600',
  },
  hint: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
});