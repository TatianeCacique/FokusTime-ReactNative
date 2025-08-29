export const translations = {
  'pt-BR': {
    // Timer
    timer: 'Timer',
    focus: 'Foco',
    shortBreak: 'Pausa Curta',
    longBreak: 'Pausa Longa',
    start: 'Iniciar',
    pause: 'Pausar',
    resume: 'Retomar',
    reset: 'Resetar',
    selectTask: 'Selecionar Tarefa',
    noTaskSelected: 'Nenhuma tarefa selecionada',
    
    // Tasks
    tasks: 'Tarefas',
    newTask: 'Nova Tarefa',
    editTask: 'Editar Tarefa',
    title: 'Título',
    description: 'Descrição',
    priority: 'Prioridade',
    tags: 'Tags',
    low: 'Baixa',
    medium: 'Média',
    high: 'Alta',
    save: 'Salvar',
    cancel: 'Cancelar',
    delete: 'Excluir',
    edit: 'Editar',
    complete: 'Concluir',
    incomplete: 'Reativar',
    searchTasks: 'Buscar tarefas...',
    noTasks: 'Nenhuma tarefa encontrada',
    createFirstTask: 'Criar primeira tarefa',
    pomodoros: 'Pomodoros',
    
    // History
    history: 'Histórico',
    insights: 'Insights',
    totalFocusToday: 'Foco Total Hoje',
    focusSessionsToday: 'Sessões de Foco Hoje',
    tasksCompleted: 'Tarefas Concluídas',
    export: 'Exportar',
    today: 'Hoje',
    thisWeek: 'Esta Semana',
    thisMonth: 'Este Mês',
    all: 'Tudo',
    noSessions: 'Nenhuma sessão encontrada',
    
    // Settings
    settings: 'Configurações',
    timerSettings: 'Configurações do Timer',
    focusDuration: 'Duração do Foco (min)',
    shortBreakDuration: 'Pausa Curta (min)',
    longBreakDuration: 'Pausa Longa (min)',
    cyclesUntilLongBreak: 'Ciclos até Pausa Longa',
    notifications: 'Notificações',
    sound: 'Som',
    vibration: 'Vibração',
    appearance: 'Aparência',
    theme: 'Tema',
    language: 'Idioma',
    dataManagement: 'Gerenciamento de Dados',
    resetData: 'Resetar Dados',
    resetDataConfirm: 'Tem certeza? Esta ação não pode ser desfeita.',
    yes: 'Sim',
    no: 'Não',
    
    // Themes
    system: 'Sistema',
    light: 'Claro',
    dark: 'Escuro',
    
    // Validation
    titleRequired: 'Título é obrigatório',
    invalidDuration: 'Duração deve ser maior que 0',
  },
  'en-US': {
    // Timer
    timer: 'Timer',
    focus: 'Focus',
    shortBreak: 'Short Break',
    longBreak: 'Long Break',
    start: 'Start',
    pause: 'Pause',
    resume: 'Resume',
    reset: 'Reset',
    selectTask: 'Select Task',
    noTaskSelected: 'No task selected',
    
    // Tasks
    tasks: 'Tasks',
    newTask: 'New Task',
    editTask: 'Edit Task',
    title: 'Title',
    description: 'Description',
    priority: 'Priority',
    tags: 'Tags',
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    complete: 'Complete',
    incomplete: 'Reactivate',
    searchTasks: 'Search tasks...',
    noTasks: 'No tasks found',
    createFirstTask: 'Create first task',
    pomodoros: 'Pomodoros',
    
    // History
    history: 'History',
    insights: 'Insights',
    totalFocusToday: 'Total Focus Today',
    focusSessionsToday: 'Focus Sessions Today',
    tasksCompleted: 'Tasks Completed',
    export: 'Export',
    today: 'Today',
    thisWeek: 'This Week',
    thisMonth: 'This Month',
    all: 'All',
    noSessions: 'No sessions found',
    
    // Settings
    settings: 'Settings',
    timerSettings: 'Timer Settings',
    focusDuration: 'Focus Duration (min)',
    shortBreakDuration: 'Short Break (min)',
    longBreakDuration: 'Long Break (min)',
    cyclesUntilLongBreak: 'Cycles Until Long Break',
    notifications: 'Notifications',
    sound: 'Sound',
    vibration: 'Vibration',
    appearance: 'Appearance',
    theme: 'Theme',
    language: 'Language',
    dataManagement: 'Data Management',
    resetData: 'Reset Data',
    resetDataConfirm: 'Are you sure? This action cannot be undone.',
    yes: 'Yes',
    no: 'No',
    
    // Themes
    system: 'System',
    light: 'Light',
    dark: 'Dark',
    
    // Validation
    titleRequired: 'Title is required',
    invalidDuration: 'Duration must be greater than 0',
  },
};

export const t = (key: keyof typeof translations['pt-BR'], locale: string = 'pt-BR'): string => {
  const translation = translations[locale as keyof typeof translations] || translations['pt-BR'];
  return translation[key] || key;
};