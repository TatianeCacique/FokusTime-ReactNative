import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure notifications behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const NotificationService = {
  async requestPermissions(): Promise<boolean> {
    if (Platform.OS === 'web') return true;

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    return finalStatus === 'granted';
  },

  async scheduleTimerComplete(seconds: number, type: 'focus' | 'shortBreak' | 'longBreak'): Promise<string | null> {
    if (Platform.OS === 'web') return null;

    try {
      const messages = {
        focus: {
          'pt-BR': {
            title: '🍅 Foco Concluído!',
            body: 'Hora de fazer uma pausa. Bom trabalho!',
          },
          'en-US': {
            title: '🍅 Focus Complete!',
            body: 'Time for a break. Great work!',
          },
        },
        shortBreak: {
          'pt-BR': {
            title: '⏱️ Pausa Curta Concluída!',
            body: 'Vamos continuar focando!',
          },
          'en-US': {
            title: '⏱️ Short Break Complete!',
            body: 'Let\'s get back to focusing!',
          },
        },
        longBreak: {
          'pt-BR': {
            title: '🎉 Pausa Longa Concluída!',
            body: 'Descansou bem? Hora de retomar!',
          },
          'en-US': {
            title: '🎉 Long Break Complete!',
            body: 'Feeling refreshed? Time to get back to work!',
          },
        },
      };

      const locale = 'pt-BR'; // This would come from settings in a real app
      const message = messages[type][locale];

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: message.title,
          body: message.body,
          sound: 'default',
        },
        trigger: { seconds },
      });

      return notificationId;
    } catch (error) {
      console.error('Error scheduling notification:', error);
      return null;
    }
  },

  async cancelNotification(notificationId: string): Promise<void> {
    if (Platform.OS === 'web') return;

    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
    } catch (error) {
      console.error('Error canceling notification:', error);
    }
  },

  async cancelAllNotifications(): Promise<void> {
    if (Platform.OS === 'web') return;

    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Error canceling all notifications:', error);
    }
  },
};