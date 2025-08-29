export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const minutesToSeconds = (minutes: number): number => minutes * 60;

export const secondsToMinutes = (seconds: number): number => Math.floor(seconds / 60);

export const formatDate = (date: string, locale: string): string => {
  return new Date(date).toLocaleDateString(locale === 'pt-BR' ? 'pt-BR' : 'en-US');
};

export const formatDateTime = (date: string, locale: string): string => {
  return new Date(date).toLocaleString(locale === 'pt-BR' ? 'pt-BR' : 'en-US');
};

export const isToday = (date: string): boolean => {
  const today = new Date();
  const checkDate = new Date(date);
  return today.toDateString() === checkDate.toDateString();
};

export const isThisWeek = (date: string): boolean => {
  const today = new Date();
  const checkDate = new Date(date);
  const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
  return checkDate >= weekStart;
};