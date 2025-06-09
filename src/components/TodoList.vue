<template>
  <div class="todo-list">
    <!-- Search and Filter Bar -->
    <v-card class="mb-6 glass-card" elevation="0">
      <v-card-text class="pb-2">
        <v-row align="center" no-gutters>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="searchQuery"
              prepend-inner-icon="mdi-magnify"
              label="Buscar tarefas..."
              variant="outlined"
              density="compact"
              hide-details
              clearable
              class="search-field"
            />
          </v-col>
          <v-col cols="12" md="6" class="pl-md-4 pt-3 pt-md-0">
            <v-row no-gutters>
              <v-col cols="6" class="pr-2">
                <v-select
                  v-model="selectedCategory"
                  :items="categoryOptions"
                  label="Categoria"
                  variant="outlined"
                  density="compact"
                  hide-details
                  clearable
                />
              </v-col>
              <v-col cols="6" class="pl-2">
                <v-select
                  v-model="selectedPriority"
                  :items="priorityOptions"
                  label="Prioridade"
                  variant="outlined"
                  density="compact"
                  hide-details
                  clearable
                />
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Todos List -->
    <v-card class="todos-container glass-card" elevation="0">
      <v-card-text class="pa-0">
        <div v-if="filteredTodos.length === 0" class="empty-state text-center py-8">
          <v-icon size="64" color="grey-lighten-2">mdi-format-list-checks</v-icon>
          <h3 class="text-h6 mb-2 text-grey-darken-1">Nenhuma tarefa encontrada</h3>
          <p class="text-body-2 text-grey">Tente ajustar os filtros ou criar uma nova tarefa</p>
        </div>

        <div v-else class="todos-list">
          <v-fade-transition group>
            <div
              v-for="todo in filteredTodos"
              :key="todo.id"
              class="todo-item"
              :class="{ 'completed-item': todo.completed }"
            >
              <v-row align="center" no-gutters class="pa-6">
                <!-- Checkbox -->
                <v-col cols="auto" class="pr-3">
                  <v-checkbox
                    :model-value="todo.completed"
                    @update:model-value="$emit('toggle-todo', todo.id)"
                    color="primary"
                    hide-details
                    density="comfortable"
                  />
                </v-col>

                <!-- Todo Content -->
                <v-col>
                  <div class="d-flex flex-column">
                    <!-- Title -->
                    <h4
                      class="todo-title mb-1"
                      :class="{
                        'text-decoration-line-through text-medium-emphasis': todo.completed,
                      }"
                    >
                      {{ todo.text }}
                    </h4>

                    <!-- Description -->
                    <p
                      v-if="todo.description"
                      class="todo-description mb-2 text-body-2"
                      :class="{
                        'text-decoration-line-through text-medium-emphasis': todo.completed,
                      }"
                    >
                      {{ todo.description }}
                    </p>

                    <!-- Meta Info -->
                    <div class="d-flex flex-wrap align-center gap-2">
                      <!-- Category -->
                      <v-chip
                        size="small"
                        :color="getCategoryColor(todo.category)"
                        :prepend-icon="getCategoryIcon(todo.category)"
                        variant="tonal"
                      >
                        {{ getCategoryLabel(todo.category) }}
                      </v-chip>

                      <!-- Priority -->
                      <v-chip
                        size="small"
                        :color="getPriorityColor(todo.priority)"
                        :prepend-icon="getPriorityIcon(todo.priority)"
                        variant="tonal"
                      >
                        {{ getPriorityLabel(todo.priority) }}
                      </v-chip>

                      <!-- Due Date -->
                      <v-chip
                        v-if="todo.dueDate"
                        size="small"
                        prepend-icon="mdi-calendar"
                        variant="tonal"
                        :color="isOverdue(todo.dueDate) ? 'error' : 'default'"
                      >
                        {{ formatDate(todo.dueDate) }}
                      </v-chip>

                      <!-- Created Date -->
                      <span class="text-caption text-medium-emphasis ml-auto">
                        Criado em {{ formatDate(todo.createdAt) }}
                      </span>
                    </div>
                  </div>
                </v-col>

                <!-- Actions -->
                <v-col cols="auto" class="pl-3">
                  <div class="d-flex flex-column gap-1">
                    <v-btn
                      icon="mdi-pencil"
                      size="small"
                      variant="text"
                      color="primary"
                      @click="editTodo(todo)"
                    />
                    <v-btn
                      icon="mdi-delete"
                      size="small"
                      variant="text"
                      color="error"
                      @click="deleteTodo(todo.id)"
                    />
                  </div>
                </v-col>
              </v-row>
            </div>
          </v-fade-transition>
        </div>
      </v-card-text>
    </v-card>

    <!-- Empty State -->
    <v-card v-if="filteredTodos.length === 0" class="text-center py-12 glass-card" elevation="0">
      <v-icon
        icon="mdi-checkbox-multiple-marked-outline"
        size="64"
        class="mb-4 text-medium-emphasis"
      />
      <h3 class="text-h6 mb-2">Nenhuma tarefa encontrada</h3>
      <p class="text-body-2 text-medium-emphasis">
        {{
          todos.length === 0
            ? "Adicione sua primeira tarefa!"
            : "Tente ajustar os filtros de busca."
        }}
      </p>
    </v-card>

    <!-- Edit Dialog -->
    <!-- Dialog removido - gerenciado pelo componente pai TodosView -->
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "TodoList",
  emits: ["delete-todo", "edit-todo", "toggle-todo"],
  data() {
    return {
      searchQuery: "",
      selectedCategory: null,
      selectedPriority: null,
      categoryOptions: [
        { title: "Geral", value: "geral" },
        { title: "Trabalho", value: "trabalho" },
        { title: "Pessoal", value: "pessoal" },
        { title: "Estudos", value: "estudos" },
        { title: "Casa", value: "casa" },
        { title: "Saúde", value: "saude" },
      ],
      priorityOptions: [
        { title: "Baixa", value: "baixa" },
        { title: "Média", value: "media" },
        { title: "Alta", value: "alta" },
      ],
    };
  },
  computed: {
    ...mapState("todos", ["todos"]),

    filteredTodos() {
      let filtered = [...this.todos];

      // Filter by search query
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(
          (todo) =>
            todo.text.toLowerCase().includes(query) ||
            (todo.description && todo.description.toLowerCase().includes(query))
        );
      }

      // Filter by category
      if (this.selectedCategory) {
        filtered = filtered.filter((todo) => todo.category === this.selectedCategory);
      }

      // Filter by priority
      if (this.selectedPriority) {
        filtered = filtered.filter((todo) => todo.priority === this.selectedPriority);
      }

      // Sort by priority and due date
      return filtered.sort((a, b) => {
        // First, sort by completion status (incomplete first)
        if (a.completed !== b.completed) {
          return a.completed ? 1 : -1;
        }

        // Then by priority
        const priorityOrder = { alta: 3, media: 2, baixa: 1 };
        const priorityDiff = (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
        if (priorityDiff !== 0) return priorityDiff;

        // Finally by due date
        if (a.dueDate && b.dueDate) {
          return new Date(a.dueDate) - new Date(b.dueDate);
        }
        if (a.dueDate) return -1;
        if (b.dueDate) return 1;

        // Default to creation date
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
    },
  },
  methods: {
    getCategoryColor(category) {
      const colors = {
        geral: "blue",
        trabalho: "indigo",
        pessoal: "pink",
        estudos: "purple",
        casa: "green",
        saude: "red",
      };
      return colors[category] || "grey";
    },

    getCategoryIcon(category) {
      const icons = {
        geral: "mdi-circle",
        trabalho: "mdi-briefcase",
        pessoal: "mdi-account",
        estudos: "mdi-school",
        casa: "mdi-home",
        saude: "mdi-heart",
      };
      return icons[category] || "mdi-tag";
    },

    getCategoryLabel(category) {
      const labels = {
        geral: "Geral",
        trabalho: "Trabalho",
        pessoal: "Pessoal",
        estudos: "Estudos",
        casa: "Casa",
        saude: "Saúde",
      };
      return labels[category] || category;
    },

    getPriorityColor(priority) {
      const colors = {
        // Portuguese values (new)
        baixa: "green",
        media: "orange",
        alta: "red",
        // English values (legacy fallback)
        low: "green",
        medium: "orange",
        high: "red",
      };
      return colors[priority] || "grey";
    },

    getPriorityIcon(priority) {
      const icons = {
        // Portuguese values (new)
        baixa: "mdi-arrow-down",
        media: "mdi-equal",
        alta: "mdi-arrow-up",
        // English values (legacy fallback)
        low: "mdi-arrow-down",
        medium: "mdi-equal",
        high: "mdi-arrow-up",
      };
      return icons[priority] || "mdi-flag";
    },

    getPriorityLabel(priority) {
      const labels = {
        // Portuguese values (new)
        baixa: "Baixa",
        media: "Média",
        alta: "Alta",
        // English values (legacy fallback)
        low: "Baixa",
        medium: "Média",
        high: "Alta",
      };
      return labels[priority] || priority;
    },

    isOverdue(dueDate) {
      if (!dueDate) return false;
      const today = new Date();
      const due = new Date(dueDate);
      today.setHours(0, 0, 0, 0);
      due.setHours(0, 0, 0, 0);
      return due < today;
    },

    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    },

    editTodo(todo) {
      this.$emit("edit-todo", todo);
    },

    deleteTodo(todoId) {
      this.$emit("delete-todo", todoId);
    },
  },
};
</script>

<style scoped>
.todo-list {
  max-width: 100%;
}

.search-field :deep(.v-field__outline) {
  border-radius: 12px;
}

/* Container das tarefas */
.todos-container {
  border-radius: 20px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background: white;
  overflow: hidden;
}

/* Lista de tarefas */
.todos-list {
  display: flex;
  flex-direction: column;
}

/* Item da tarefa */
.todo-item {
  border-bottom: 1px solid #e2e8f0;
  transition: all 0.3s ease;
  cursor: pointer;
}

.todo-item:last-child {
  border-bottom: none;
}

.todo-item:hover {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.02) 0%, rgba(118, 75, 162, 0.02) 100%);
  border-radius: 12px;
  margin: 0 -12px;
  border-bottom: 1px solid transparent;
}

.todo-item:hover + .todo-item {
  border-top: 1px solid transparent;
}

.completed-item {
  opacity: 0.7;
}

.todo-title {
  font-weight: 600;
  font-size: 1.1rem;
  line-height: 1.4;
  color: #1e293b;
  margin-bottom: 6px;
}

.todo-description {
  color: rgba(var(--v-theme-on-surface), 0.7);
  line-height: 1.4;
}

/* Empty State */
.empty-state {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.03) 0%, rgba(118, 75, 162, 0.03) 100%);
  border-radius: 20px;
  border: 2px dashed rgba(102, 126, 234, 0.2);
  margin: 2rem;
}

.gap-2 {
  gap: 8px;
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
  .todo-item {
    padding: 0;
  }

  .todo-item .v-row {
    padding: 16px;
  }

  .todo-title {
    font-size: 1rem;
    line-height: 1.3;
  }

  .todo-description {
    font-size: 0.875rem;
  }

  .gap-2 {
    gap: 6px;
  }
}

@media (max-width: 600px) {
  .todo-card :deep(.v-card-text) {
    padding: 12px 16px;
  }

  .todo-item .v-row {
    padding: 12px;
  }

  .todo-title {
    font-size: 0.95rem;
    margin-bottom: 4px;
  }

  .todo-description {
    font-size: 0.825rem;
    margin-bottom: 8px;
  }

  .d-flex.flex-column.gap-1 {
    flex-direction: row !important;
    gap: 4px !important;
  }

  /* Melhora o layout dos chips em mobile */
  .d-flex.flex-wrap.align-center.gap-2 {
    flex-direction: column;
    align-items: flex-start !important;
    gap: 8px;
  }

  .d-flex.flex-wrap.align-center.gap-2 > .v-chip {
    margin-right: 4px;
    margin-bottom: 2px;
  }

  .text-caption.text-medium-emphasis.ml-auto {
    margin-left: 0 !important;
    margin-top: 4px;
    font-size: 0.75rem;
  }
}

@media (max-width: 480px) {
  .todos-container {
    border-radius: 16px;
    margin: 0 -8px;
  }

  .todo-item .v-row {
    padding: 10px;
  }

  .todo-title {
    font-size: 0.9rem;
  }

  .v-chip {
    font-size: 0.7rem;
    height: 22px;
  }

  .empty-state {
    margin: 1rem;
    padding: 1.5rem;
  }
}
</style>
