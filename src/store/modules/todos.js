// Estado para gerenciar todos
const state = {
  todos: migrateTodosData(JSON.parse(localStorage.getItem("todos")) || []),
  filter: "all", // all, active, completed
  searchQuery: "",
};

// Função para migrar dados antigos de prioridade
function migrateTodosData(todos) {
  const priorityMigration = {
    high: "alta",
    medium: "media",
    low: "baixa",
  };

  let hasChanges = false;
  const migratedTodos = todos.map((todo) => {
    if (todo.priority && priorityMigration[todo.priority]) {
      hasChanges = true;
      return {
        ...todo,
        priority: priorityMigration[todo.priority],
      };
    }
    return todo;
  });

  // Save back to localStorage if we made changes
  if (hasChanges) {
    localStorage.setItem("todos", JSON.stringify(migratedTodos));
  }

  return migratedTodos;
}

// Getters para acessar e computar estados
const getters = {
  allTodos: (state) => state.todos,

  filteredTodos: (state, getters) => {
    let todos = getters.allTodos;

    // Filtro por texto de busca
    if (state.searchQuery) {
      todos = todos.filter((todo) =>
        todo.text.toLowerCase().includes(state.searchQuery.toLowerCase())
      );
    }

    // Filtro por status
    switch (state.filter) {
      case "active":
        return todos.filter((todo) => !todo.completed);
      case "completed":
        return todos.filter((todo) => todo.completed);
      default:
        return todos;
    }
  },

  activeTodosCount: (state, getters) => getters.allTodos.filter((todo) => !todo.completed).length,

  completedTodosCount: (state, getters) => getters.allTodos.filter((todo) => todo.completed).length,

  totalTodosCount: (state, getters) => getters.allTodos.length,

  currentFilter: (state) => state.filter,

  searchQuery: (state) => state.searchQuery,
};

// Mutations para modificar o estado
const mutations = {
  ADD_TODO(state, todo) {
    state.todos.push({
      id: Date.now(),
      text: todo.text,
      completed: false,
      createdAt: new Date().toISOString(),
      priority: todo.priority || "medium",
      category: todo.category || "geral",
    });
    saveTodosToLocalStorage(state.todos);
  },

  REMOVE_TODO(state, todoId) {
    state.todos = state.todos.filter((todo) => todo.id !== todoId);
    saveTodosToLocalStorage(state.todos);
  },

  TOGGLE_TODO(state, todoId) {
    const todo = state.todos.find((todo) => todo.id === todoId);
    if (todo) {
      todo.completed = !todo.completed;
      todo.completedAt = todo.completed ? new Date().toISOString() : null;
    }
    saveTodosToLocalStorage(state.todos);
  },

  UPDATE_TODO(state, { id, updates }) {
    const todo = state.todos.find((todo) => todo.id === id);
    if (todo) {
      Object.assign(todo, updates);
      todo.updatedAt = new Date().toISOString();
    }
    saveTodosToLocalStorage(state.todos);
  },

  SET_FILTER(state, filter) {
    state.filter = filter;
  },

  SET_TODOS(state, todos) {
    state.todos = todos;
    saveTodosToLocalStorage(state.todos);
  },

  SET_SEARCH_QUERY(state, query) {
    state.searchQuery = query;
  },

  CLEAR_COMPLETED(state) {
    state.todos = state.todos.filter((todo) => !todo.completed);
    saveTodosToLocalStorage(state.todos);
  },

  MARK_ALL_COMPLETE(state) {
    state.todos.forEach((todo) => {
      todo.completed = true;
      todo.completedAt = new Date().toISOString();
    });
    saveTodosToLocalStorage(state.todos);
  },

  MARK_ALL_INCOMPLETE(state) {
    state.todos.forEach((todo) => {
      todo.completed = false;
      todo.completedAt = null;
    });
    saveTodosToLocalStorage(state.todos);
  },
};

// Actions para operações assíncronas
const actions = {
  addTodo({ commit }, todo) {
    if (todo.text && todo.text.trim()) {
      commit("ADD_TODO", {
        text: todo.text.trim(),
        priority: todo.priority,
        category: todo.category,
      });
    }
  },

  removeTodo({ commit }, todoId) {
    commit("REMOVE_TODO", todoId);
  },

  toggleTodo({ commit }, todoId) {
    commit("TOGGLE_TODO", todoId);
  },

  updateTodo({ commit }, payload) {
    commit("UPDATE_TODO", payload);
  },

  setFilter({ commit }, filter) {
    commit("SET_FILTER", filter);
  },

  setSearchQuery({ commit }, query) {
    commit("SET_SEARCH_QUERY", query);
  },

  clearCompleted({ commit }) {
    commit("CLEAR_COMPLETED");
  },

  toggleAllTodos({ commit, getters }) {
    const allCompleted = getters.allTodos.every((todo) => todo.completed);
    if (allCompleted) {
      commit("MARK_ALL_INCOMPLETE");
    } else {
      commit("MARK_ALL_COMPLETE");
    }
  },

  // Migration action to convert old priority values
  migratePriorityValues({ commit, state }) {
    const priorityMigration = {
      high: "alta",
      medium: "media",
      low: "baixa",
    };

    let hasChanges = false;
    const migratedTodos = state.todos.map((todo) => {
      if (todo.priority && priorityMigration[todo.priority]) {
        hasChanges = true;
        return {
          ...todo,
          priority: priorityMigration[todo.priority],
        };
      }
      return todo;
    });

    if (hasChanges) {
      commit("SET_TODOS", migratedTodos);
    }
  },
};

// Função utilitária para salvar no localStorage
function saveTodosToLocalStorage(todos) {
  localStorage.setItem("todos", JSON.stringify(todos));
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
