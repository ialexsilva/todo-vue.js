# 📝 Todo Vue App

<div align="center">

![Vue.js](https://img.shields.io/badge/Vue.js-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)
![Vuetify](https://img.shields.io/badge/Vuetify-1867C0?style=for-the-badge&logo=vuetify&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)

**Um aplicativo moderno de gerenciamento de tarefas desenvolvido com Vue.js 3**

Gerencie suas tarefas de forma simples, elegante e eficiente com interface responsiva e design Material.

[Demo](#) • [Documentação](#-funcionalidades) • [Instalação](#-instalação-e-execução)

</div>

---

## 🚀 Tecnologias Utilizadas

| Tecnologia                | Versão  | Descrição                                |
| ------------------------- | ------- | ---------------------------------------- |
| **Vue.js 3**              | ^3.4.21 | Framework JavaScript progressivo         |
| **Vuetify 3**             | ^3.5.17 | Framework de componentes Material Design |
| **Vuex 4**                | ^4.1.0  | Gerenciamento de estado centralizado     |
| **Vue Router 4**          | ^4.3.0  | Roteamento oficial para Vue.js           |
| **Vite**                  | ^5.2.0  | Build tool rápido e moderno              |
| **Material Design Icons** | ^7.4.47 | Ícones Material Design                   |

## ✨ Funcionalidades

### 🎯 Gerenciamento de Tarefas

- ➕ **Adicionar tarefas** com título, descrição e metadata
- ✏️ **Editar tarefas** existentes de forma intuitiva
- 🗑️ **Remover tarefas** com confirmação
- ✅ **Marcar como concluída** com um clique
- 🏷️ **Categorizar tarefas** (Geral, Trabalho, Pessoal, Estudos, Casa, Saúde)
- 🚩 **Definir prioridades** (Alta, Média, Baixa)

### 🔍 Filtragem e Busca

- 🔎 **Busca em tempo real** por título ou descrição
- 📂 **Filtro por categoria** para organização
- 🎚️ **Filtro por prioridade** para foco
- 📊 **Filtro por status** (Todas, Pendentes, Concluídas)

### 📱 Interface e UX

- 🎨 **Design Material** moderno e elegante
- 📱 **Totalmente responsivo** para mobile, tablet e desktop
- 🌓 **Tema claro/escuro** personalizável
- 🔄 **Animações suaves** e transições fluidas
- 📊 **Dashboard estatístico** com progresso visual
- 🎛️ **Sidebar navegacional** com menu intuitivo

### ⚡ Performance e Dados

- 💾 **Armazenamento local** automático (localStorage)
- 🚀 **Carregamento rápido** com Vite
- 🔄 **Sincronização em tempo real** entre componentes
- 📈 **Estatísticas dinâmicas** e círculos de progresso

### 🛠️ Ações em Lote

- ✅ **Marcar/Desmarcar todas** as tarefas
- 🧹 **Limpar tarefas concluídas** em massa
- 📊 **Visualizar estatísticas** consolidadas

## 📱 Screenshots

### 🏠 Página Inicial

Interface limpa com estatísticas visuais e tarefas recentes.

### 📋 Gerenciamento de Tarefas

Lista completa com filtros avançados e ações rápidas.

### 📱 Responsividade Mobile

Design otimizado para dispositivos móveis com navegação touch-friendly.

## 🛠️ Instalação e Execução

### 📋 Pré-requisitos

Certifique-se de ter instalado:

- **Node.js** (versão 16 ou superior)
- **npm** ou **yarn** ou **pnpm**

### 🚀 Instalação Rápida

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/todo-vue-app.git

# Navegue para o diretório
cd todo-vue-app

# Instale as dependências
npm install

# Execute o projeto
npm run dev
```

### 📜 Scripts Disponíveis

| Script              | Comando           | Descrição                          |
| ------------------- | ----------------- | ---------------------------------- |
| **Desenvolvimento** | `npm run dev`     | Inicia servidor de desenvolvimento |
| **Build**           | `npm run build`   | Gera build otimizado para produção |
| **Preview**         | `npm run preview` | Visualiza o build de produção      |
| **Serve**           | `npm run serve`   | Serve arquivos de produção         |

### 🌐 Acesso

Após executar `npm run dev`, acesse:

**🔗 http://localhost:5173**

## 📁 Arquitetura do Projeto

```
📦 todo-vue/
├── 📄 index.html              # Template HTML principal
├── 📦 package.json            # Dependências e scripts
├── ⚙️ vite.config.js          # Configuração do Vite
├── 📂 src/
│   ├── 🎯 App.vue             # Componente raiz
│   ├── 🚀 main.js             # Ponto de entrada
│   ├── 📂 components/         # Componentes reutilizáveis
│   │   ├── ➕ AddTodoForm.vue
│   │   ├── 📝 TodoList.vue
│   │   └── ✏️ EditTodoDialog.vue
│   ├── 📂 views/              # Páginas da aplicação
│   │   ├── 🏠 HomeView.vue
│   │   ├── 📋 TodosView.vue
│   │   └── ℹ️ AboutView.vue
│   ├── 📂 store/              # Gerenciamento de estado
│   │   ├── 📄 index.js
│   │   └── 📂 modules/
│   │       ├── 📝 todos.js
│   │       └── 🎨 ui.js
│   ├── 📂 router/             # Configuração de rotas
│   │   └── 🛣️ index.js
│   ├── 📂 plugins/            # Plugins e configurações
│   │   └── 🎨 vuetify.js
│   ├── 📂 utils/              # Funções utilitárias
│   │   └── 🔧 helpers.js
│   └── 📂 assets/             # Recursos estáticos
│       └── 🎨 global-styles.css
```

## 🧠 Conceitos Técnicos Demonstrados

### 🔧 Vue.js 3 - Composition API

```javascript
// Exemplo de composição reativa
const { reactive, computed, watch } = Vue;
const state = reactive({
  todos: [],
  filter: "all",
});

const filteredTodos = computed(() =>
  state.todos.filter(
    (todo) => state.filter === "all" || todo.completed === (state.filter === "completed")
  )
);
```

### 🗃️ Vuex 4 - Gerenciamento de Estado

```javascript
// Módulo de todos com namespacing
const todosModule = {
  namespaced: true,
  state: () => ({ todos: [] }),
  mutations: { ADD_TODO, UPDATE_TODO, DELETE_TODO },
  actions: { addTodo, updateTodo, deleteTodo },
  getters: { activeTodos, completedTodos, totalCount },
};
```

### 🛣️ Vue Router 4 - Roteamento

```javascript
// Rotas com lazy loading
const routes = [
  { path: "/", component: () => import("./views/HomeView.vue") },
  { path: "/todos", component: () => import("./views/TodosView.vue") },
  { path: "/about", component: () => import("./views/AboutView.vue") },
];
```

### 🎨 Vuetify 3 - Material Design

```vue
<!-- Componentes responsivos e temáticos -->
<v-card class="glass-card" elevation="0">
  <v-card-text>
    <v-row>
      <v-col cols="12" md="6">
        <v-text-field variant="outlined" />
      </v-col>
    </v-row>
  </v-card-text>
</v-card>
```

## 📊 Gerenciamento de Estado

### 🏪 Store Modules

#### `todos.js` - Gerenciamento de Tarefas

- **State**: Lista de todos, filtros ativos, query de busca
- **Mutations**: Operações síncronas de CRUD
- **Actions**: Operações assíncronas e lógica de negócio
- **Getters**: Computações derivadas e filtros

#### `ui.js` - Interface do Usuário

- **State**: Tema, sidebar, loading states, notificações
- **Mutations**: Alterações de UI
- **Actions**: Interações complexas de UI

### 💾 Persistência de Dados

```javascript
// Armazenamento automático no localStorage
const saveTodosToLocalStorage = (todos) => {
  localStorage.setItem("todos", JSON.stringify(todos));
};

// Recuperação na inicialização
const loadTodosFromLocalStorage = () => {
  const saved = localStorage.getItem("todos");
  return saved ? JSON.parse(saved) : [];
};
```

## 🎨 Customização e Temas

### 🌈 Configuração de Cores

```javascript
// vuetify.js - Personalização de tema
const customTheme = {
  dark: false,
  colors: {
    primary: "#667eea",
    secondary: "#764ba2",
    accent: "#ff6b6b",
    success: "#10b981",
    warning: "#f59e0b",
    error: "#ef4444",
  },
};
```

### 📱 Design Responsivo

```scss
// Breakpoints personalizados
@media (max-width: 768px) {
  .stat-circle-inner {
    width: 125px;
    height: 125px;
  }
}

@media (max-width: 480px) {
  .todo-item {
    padding: 12px;
  }
}
```

## 🔧 Configurações Avançadas

### ⚡ Vite Configuration

```javascript
// vite.config.js
export default defineConfig({
  plugins: [
    vue(),
    vuetify({
      customProperties: true,
      theme: { cspNonce: "nonce" },
    }),
  ],
  define: { "process.env": {} },
});
```

### 📦 Build Otimizado

```bash
# Build para produção com otimizações
npm run build

# Análise do bundle
npm run build -- --analyze

# Preview do build
npm run preview
```

## 🧪 Padrões e Melhores Práticas

### 🏗️ Arquitetura de Componentes

- **Single File Components** (SFC)
- **Props down, events up** pattern
- **Composition API** para lógica reutilizável
- **Scoped styles** para encapsulamento

### 📝 Convenções de Código

- **camelCase** para variáveis e métodos
- **PascalCase** para componentes
- **kebab-case** para arquivos
- **Comentários em português** para clareza

### 🔒 Tratamento de Erros

```javascript
// Validação e fallbacks
const getPriorityColor = (priority) => {
  const colors = {
    baixa: "green",
    media: "orange",
    alta: "red",
  };
  return colors[priority] || "grey"; // Fallback
};
```

## 🚀 Performance

### ⚡ Otimizações Implementadas

- **Lazy loading** de rotas
- **Computed properties** para filtros
- **V-show vs v-if** estratégico
- **Debounce** em buscas
- **Tree shaking** automático

### 📊 Métricas

- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3s
- **Bundle size**: ~200KB (gzipped)

## 🔜 Roadmap Futuro

### 📅 Próximas Funcionalidades

- [ ] 🔄 **Sincronização na nuvem**
- [ ] 👥 **Compartilhamento de listas**
- [ ] 📅 **Calendário integrado**
- [ ] 🔔 **Notificações push**
- [ ] 📊 **Relatórios avançados**
- [ ] 🎯 **Metas e objetivos**
- [ ] 🔗 **API REST/GraphQL**
- [ ] 📱 **PWA completo**

### 🛠️ Melhorias Técnicas

- [ ] ⚡ **Vue 3.5** upgrade
- [ ] 🧪 **Testes unitários** (Vitest)
- [ ] 🧪 **Testes E2E** (Playwright)
- [ ] 📦 **Docker** containerization
- [ ] 🚀 **CI/CD** pipeline

## 🤝 Contribuindo

### 🔧 Como Contribuir

1. **Fork** o projeto
2. **Clone** seu fork
3. **Crie** uma branch para sua feature
4. **Implemente** suas mudanças
5. **Teste** as modificações
6. **Commit** com mensagens claras
7. **Push** para sua branch
8. **Abra** um Pull Request

### 📝 Convenções de Commit

```bash
# Tipos de commit
feat: nova funcionalidade
fix: correção de bug
docs: documentação
style: formatação
refactor: refatoração
test: testes
chore: tarefas de manutenção

# Exemplo
git commit -m "feat: adicionar filtro por data de vencimento"
```

## 📄 Licença

**MIT License** - Este projeto é open source e está disponível sob a [Licença MIT](LICENSE).

---

<div align="center">

**Desenvolvido com ❤️ por [Seu Nome]**

Usando Vue.js e as melhores práticas de desenvolvimento frontend moderno.

![Vue.js](https://img.shields.io/badge/Made%20with-Vue.js-4FC08D?style=flat&logo=vue.js&logoColor=white)
![Vuetify](https://img.shields.io/badge/UI-Vuetify-1867C0?style=flat&logo=vuetify&logoColor=white)
![Vite](https://img.shields.io/badge/Build-Vite-646CFF?style=flat&logo=vite&logoColor=white)

⭐ **Se este projeto te ajudou, considere deixar uma estrela!** ⭐

</div>
npm run dev
```

O aplicativo estará disponível em `http://localhost:3000`

### Build para Produção

Para gerar os arquivos de produção:

```bash
npm run build
```

Para visualizar o build de produção:

```bash
npm run preview
```

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── AddTodoForm.vue
│   ├── TodoList.vue
│   └── EditTodoDialog.vue
├── views/              # Páginas da aplicação
│   ├── HomeView.vue
│   ├── TodosView.vue
│   └── AboutView.vue
├── store/              # Gerenciamento de estado (Vuex)
│   ├── index.js
│   └── modules/
│       ├── todos.js
│       └── ui.js
├── router/             # Configuração de rotas
│   └── index.js
├── plugins/            # Plugins (Vuetify)
│   └── vuetify.js
├── utils/              # Funções utilitárias
│   └── helpers.js
├── assets/             # Recursos estáticos
├── App.vue             # Componente principal
└── main.js             # Ponto de entrada
```

## 🎯 Principais Conceitos Demonstrados

### Vue.js 3

- Composition API e Options API
- Componentes reutilizáveis
- Props e emits
- Watchers e computed properties
- Lifecycle hooks

### Vuex 4

- Modules para organização do estado
- Actions, mutations e getters
- Namespaced modules
- Persistência com localStorage

### Vue Router 4

- Roteamento declarativo
- Navigation guards
- Meta fields para títulos de página

### Vuetify 3

- Sistema de grid responsivo
- Componentes Material Design
- Temas (claro/escuro)
- Icons (Material Design Icons)

### Vite

- Build tool moderno
- Hot Module Replacement (HMR)
- Otimizações automáticas

## 📊 Funcionalidades de Estado

O aplicativo utiliza Vuex para gerenciar dois módulos principais:

### Módulo Todos

- Armazenamento de tarefas
- Filtros e busca
- Operações CRUD
- Persistência em localStorage

### Módulo UI

- Tema (claro/escuro)
- Sidebar
- Loading states
- Notificações (snackbar)

## 🎨 Personalização

O aplicativo suporta temas personalizáveis através do Vuetify. Você pode modificar as cores e estilos no arquivo `src/plugins/vuetify.js`.

## 📝 Licença

MIT License - veja o arquivo LICENSE para detalhes.

## 🤝 Contribuições

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

---

Desenvolvido com ❤️ usando Vue.js e as melhores práticas de desenvolvimento frontend.
