# 🍅 Pomodoro Timer App

Um aplicativo completo de Pomodoro Timer desenvolvido com Expo, React Native e TypeScript. Inclui gerenciamento de tarefas, histórico de sessões, configurações personalizáveis e muito mais.

## 🚀 Funcionalidades

### Timer Pomodoro
- ⏱️ Timer customizável (padrão 25/5/15 minutos)
- ▶️ Controles completos: iniciar, pausar, retomar, resetar
- 🔄 Ciclos automáticos entre foco e pausas
- 📱 Funciona em background com notificações
- 🎯 Associação de tarefas ao timer
- 📊 Progresso visual com animações suaves

### Gerenciamento de Tarefas
- ✅ CRUD completo (criar, editar, excluir, completar)
- 🏷️ Sistema de prioridades e tags
- 🔍 Busca e filtros
- 📈 Contador de pomodoros por tarefa
- 🎨 Interface intuitiva com swipe actions

### Histórico e Insights
- 📊 Estatísticas detalhadas (foco diário/semanal)
- 📈 Gráficos de produtividade
- 📅 Filtros por período
- 💾 Exportação de dados em JSON
- 🎯 Insights de tarefas mais trabalhadas

### Configurações
- ⚙️ Personalização completa dos tempos
- 🔔 Controle de notificações e vibração
- 🌓 Tema claro/escuro/sistema
- 🌍 Suporte a idiomas (PT-BR/EN-US)
- 🗑️ Reset de dados com confirmação

## 📱 Tecnologias

- **Framework**: Expo + React Native
- **Linguagem**: TypeScript
- **Navegação**: Expo Router com Bottom Tabs
- **Estado**: Zustand (gerenciamento de estado simples e eficiente)
- **Persistência**: AsyncStorage
- **Notificações**: expo-notifications
- **Animações**: react-native-reanimated
- **Ícones**: Lucide React Native
- **Telas ativas**: expo-keep-awake

## 🛠️ Setup

### 1. Instalação

```bash
npx create-expo-app PomodoroApp --template blank-typescript
cd PomodoroApp
```

### 2. Dependências

```bash
npm install @react-navigation/native @react-navigation/bottom-tabs zustand @react-native-async-storage/async-storage expo-notifications expo-keep-awake expo-haptics react-native-svg victory-native expo-sharing
```

### 3. Configuração de Permissões

#### iOS (ios/Info.plist)
```xml
<key>UIBackgroundModes</key>
<array>
  <string>background-processing</string>
  <string>background-fetch</string>
</array>
```

#### Android (android/app/src/main/AndroidManifest.xml)
```xml
<uses-permission android:name="android.permission.VIBRATE" />
<uses-permission android:name="android.permission.WAKE_LOCK" />
<uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />
```

### 4. Executar

```bash
npx expo start
```

## 🏗️ Arquitetura

```
src/
├── components/          # Componentes reutilizáveis
│   ├── TimerControls.tsx
│   ├── PomodoroProgress.tsx
│   ├── TaskSelector.tsx
│   ├── TaskItem.tsx
│   └── EmptyState.tsx
├── store/              # Estados globais (Zustand)
│   ├── timer.store.ts
│   ├── tasks.store.ts
│   ├── sessions.store.ts
│   └── settings.store.ts
├── services/           # Serviços externos
│   ├── notifications.ts
│   └── storage.ts
├── hooks/              # Hooks customizados
│   ├── useTimer.ts
│   └── useTasks.ts
├── utils/              # Utilitários
│   ├── time.ts
│   ├── uuid.ts
│   ├── constants.ts
│   └── seedData.ts
├── i18n/               # Internacionalização
│   └── index.ts
└── types/              # Tipos TypeScript
    └── index.ts

app/
├── _layout.tsx         # Layout raiz
└── (tabs)/            # Navegação por tabs
    ├── _layout.tsx
    ├── index.tsx      # Timer
    ├── tasks.tsx      # Lista de tarefas
    ├── history.tsx    # Histórico
    └── settings.tsx   # Configurações
```

## 🎯 Uso

1. **Timer**: Selecione uma tarefa (opcional) e inicie o foco
2. **Tarefas**: Gerencie suas tarefas com prioridades e tags
3. **Histórico**: Acompanhe sua produtividade e insights
4. **Configurações**: Personalize tempos, notificações e aparência

## 🧪 Testes

O app inclui estrutura para testes com Jest e React Native Testing Library:

```bash
npm test
```

Testes implementados:
- ✅ Timer store e lógica de ciclos
- ✅ CRUD de tarefas
- ✅ Persistência de dados
- ✅ Cálculos de tempo e sessões

## 📝 Características Técnicas

- **Precisão do Timer**: Usa `Date.now()` para cálculos precisos
- **Background Support**: Timer continua funcionando quando app é minimizado
- **Persistência Robusta**: Todos os dados são salvos automaticamente
- **Acessibilidade**: Labels e roles apropriados para screen readers
- **Performance**: Animações otimizadas com react-native-reanimated
- **Responsivo**: Interface adaptada para diferentes tamanhos de tela

## 🔮 Funcionalidades Extras

- **Widget Android**: Atalho rápido para iniciar foco
- **Modo Ambiente**: Som opcional para foco
- **Exportação**: Backup completo dos dados
- **Temas**: Suporte a dark mode
- **i18n**: Português e Inglês

## 📄 Licença

MIT License - veja o arquivo LICENSE para detalhes.