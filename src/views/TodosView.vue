<template>
  <div class="todos-view">
    <!-- Page Header -->
    <div class="page-header mb-8">
      <div class="header-actions">
        <v-btn icon size="large" variant="text" color="white" @click="goToHome" class="back-btn">
          <v-icon size="28">mdi-arrow-left</v-icon>
          <v-tooltip activator="parent" location="bottom"> Voltar ao Início </v-tooltip>
        </v-btn>
      </div>
      <div class="header-content">
        <div class="header-icon">
          <v-icon size="48" color="white">mdi-format-list-checks</v-icon>
        </div>
        <h1 class="header-title cursor-pointer" @click="goToHome">Minhas Tarefas</h1>
        <p class="header-subtitle">Organize suas atividades de forma eficiente</p>
      </div>
      <div class="header-background"></div>
    </div>

    <!-- Add Todo Form -->
    <div class="form-section mb-8">
      <AddTodoForm @todo-added="onTodoAdded" />
    </div>

    <!-- Stats & Quick Actions -->
    <div class="stats-section mb-8" v-if="totalTodos > 0">
      <v-row>
        <v-col cols="12" lg="8">
          <v-card class="stats-card" elevation="0">
            <v-card-text class="pa-6">
              <div class="stats-container">
                <div class="stat-item">
                  <div class="stat-circle pending">
                    <span class="stat-number">{{ activeTodos }}</span>
                  </div>
                  <span class="stat-label">Pendente{{ activeTodos !== 1 ? "s" : "" }}</span>
                </div>

                <div class="stat-item">
                  <div class="stat-circle completed">
                    <span class="stat-number">{{ completedTodos }}</span>
                  </div>
                  <span class="stat-label">Concluída{{ completedTodos !== 1 ? "s" : "" }}</span>
                </div>

                <div class="stat-item">
                  <div class="stat-circle total">
                    <span class="stat-number">{{ totalTodos }}</span>
                  </div>
                  <span class="stat-label">Total</span>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" lg="4">
          <v-card class="actions-card" elevation="0">
            <v-card-text class="pa-6">
              <div class="actions-container">
                <v-btn
                  :color="allCompleted ? 'warning' : 'success'"
                  variant="elevated"
                  size="default"
                  @click="toggleAllTodos"
                  class="action-btn"
                  block
                  rounded="lg"
                >
                  <v-icon left size="18">{{
                    allCompleted ? "mdi-checkbox-blank-outline" : "mdi-check-all"
                  }}</v-icon>
                  {{ allCompleted ? "Desmarcar Todas" : "Marcar Todas" }}
                </v-btn>

                <v-btn
                  color="error"
                  variant="elevated"
                  size="default"
                  @click="clearCompleted"
                  :disabled="completedTodos === 0"
                  class="action-btn"
                  block
                  rounded="lg"
                >
                  <v-icon left size="18">mdi-delete-sweep</v-icon>
                  Limpar Concluídas
                </v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <!-- Todo List Container -->
    <div class="list-container">
      <v-card class="todo-list-card" elevation="0">
        <v-card-text class="pa-0">
          <div v-if="filteredTodos.length === 0" class="empty-state">
            <div class="empty-icon">
              <v-icon size="80" color="grey-lighten-2">
                {{ searchQuery ? "mdi-magnify" : "mdi-format-list-checks" }}
              </v-icon>
            </div>
            <h3 class="empty-title">
              {{ searchQuery ? "Nenhuma tarefa encontrada" : "Nenhuma tarefa ainda" }}
            </h3>
            <p class="empty-subtitle">
              {{
                searchQuery
                  ? "Tente ajustar os filtros de busca"
                  : "Comece adicionando uma nova tarefa!"
              }}
            </p>
          </div>

          <div v-else class="todo-list-wrapper">
            <TodoList @toggle-todo="toggleTodo" @delete-todo="deleteTodo" @edit-todo="editTodo" />
          </div>
        </v-card-text>
      </v-card>
    </div>

    <!-- Edit Todo Dialog -->
    <EditTodoDialog v-model="editDialog" :todo="editingTodo" @save="saveEditedTodo" />
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import AddTodoForm from "@/components/AddTodoForm.vue";
import TodoList from "@/components/TodoList.vue";
import EditTodoDialog from "@/components/EditTodoDialog.vue";

export default {
  name: "TodosView",

  components: {
    AddTodoForm,
    TodoList,
    EditTodoDialog,
  },

  data() {
    return {
      selectedFilter: "all",
      editDialog: false,
      editingTodo: null,
      filterOptions: [
        { value: "all", label: "Todas", icon: "mdi-format-list-checks" },
        { value: "active", label: "Pendentes", icon: "mdi-clock-outline" },
        { value: "completed", label: "Concluídas", icon: "mdi-check-circle" },
      ],
    };
  },

  computed: {
    ...mapGetters({
      filteredTodos: "todos/filteredTodos",
      allTodos: "todos/allTodos",
      activeTodos: "todos/activeTodosCount",
      completedTodos: "todos/completedTodosCount",
      totalTodos: "todos/totalTodosCount",
      currentFilter: "todos/currentFilter",
      currentSearchQuery: "todos/searchQuery",
    }),

    searchQuery: {
      get() {
        return this.currentSearchQuery;
      },
      set(value) {
        this.setSearchQuery(value);
      },
    },

    allCompleted() {
      return this.totalTodos > 0 && this.activeTodos === 0;
    },
  },

  watch: {
    selectedFilter(newFilter) {
      this.setFilter(newFilter);
    },
  },

  mounted() {
    // Aplica filtro baseado nos query parameters da URL
    const urlFilter = this.$route.query.filter;
    if (urlFilter) {
      this.applyUrlFilter(urlFilter);
    } else {
      this.selectedFilter = this.currentFilter;
    }
  },

  methods: {
    ...mapActions({
      addTodo: "todos/addTodo",
      toggleTodo: "todos/toggleTodo",
      removeTodo: "todos/removeTodo",
      updateTodo: "todos/updateTodo",
      setFilter: "todos/setFilter",
      setSearchQuery: "todos/setSearchQuery",
      clearCompleted: "todos/clearCompleted",
      toggleAllTodos: "todos/toggleAllTodos",
      showSnackbar: "ui/showSnackbar",
    }),

    applyUrlFilter(filter) {
      // Mapeia os filtros da URL para os filtros internos
      const filterMap = {
        all: "all",
        pending: "active",
        completed: "completed",
      };

      const mappedFilter = filterMap[filter] || "all";
      this.selectedFilter = mappedFilter;
      this.setFilter(mappedFilter);

      // Remove o query parameter da URL para limpar a URL
      this.$router.replace({ path: "/todos" });
    },

    onTodoAdded() {
      // Exibe mensagem de sucesso
      this.showSnackbar({
        message: "Tarefa adicionada com sucesso!",
        color: "success",
      });

      // Força atualização imediata dos filtros se necessário
      this.$nextTick(() => {
        this.setFilter(this.selectedFilter);
      });
    },

    deleteTodo(todoId) {
      this.removeTodo(todoId);
      this.showSnackbar({
        message: "Tarefa removida com sucesso!",
        color: "info",
      });
    },

    editTodo(todo) {
      this.editingTodo = { ...todo };
      this.editDialog = true;
    },

    saveEditedTodo(updatedTodo) {
      this.updateTodo({
        id: updatedTodo.id,
        updates: {
          text: updatedTodo.text,
          priority: updatedTodo.priority,
          category: updatedTodo.category,
        },
      });

      this.editDialog = false;
      this.editingTodo = null;

      this.showSnackbar({
        message: "Tarefa atualizada com sucesso!",
        color: "success",
      });
    },

    goToHome() {
      this.$router.push("/");
    },
  },
};
</script>

<style scoped>
.todos-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
  min-height: 100vh;
  background: #f8fafc;
}

/* Page Header */
.page-header {
  position: relative;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 24px;
  overflow: hidden;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="75" cy="75" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="25" cy="75" r="1" fill="rgba(255,255,255,0.05)"/><circle cx="75" cy="25" r="1" fill="rgba(255,255,255,0.05)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
  opacity: 0.6;
}

.header-content {
  position: relative;
  z-index: 2;
  text-align: center;
  color: white;
}

.header-actions {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 4;
}

.back-btn {
  opacity: 0.9;
  transition: all 0.3s ease;
}

.back-btn:hover {
  opacity: 1;
  transform: scale(1.1);
  background: rgba(255, 255, 255, 0.1);
}

.header-icon {
  margin-bottom: 10px;
  opacity: 0.9;
}

.header-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0;
  margin-bottom: 8px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
}

.header-title:hover {
  opacity: 0.8;
  transform: scale(1.02);
}

.cursor-pointer {
  cursor: pointer;
}

.header-subtitle {
  font-size: 1.1rem;
  opacity: 0.9;
  margin: 0;
  font-weight: 300;
}

/* Form Section */
.form-section {
  position: relative;
  z-index: 3;
  margin-bottom: 40px;
}

/* Stats Section */
.stats-section {
  margin-top: -20px;
  position: relative;
  z-index: 2;
}

.stats-card,
.actions-card {
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 20px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.1);
}

.stats-card:hover,
.actions-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.v-theme--dark .stats-card,
.v-theme--dark .actions-card {
  background: rgb(30, 30, 30);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* Stats Container */
.stats-container {
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-wrap: wrap;
  gap: 24px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  flex: 1;
  min-width: 100px;
}

.stat-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  position: relative;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.stat-circle:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.15);
}

.stat-circle.pending {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.stat-circle.completed {
  background: linear-gradient(135deg, #56ab2f 0%, #a8e6cf 100%);
}

.stat-circle.total {
  background: linear-gradient(135deg, #ff6b6b 0%, #feca57 100%);
}

.stat-circle .stat-number {
  font-size: 1.75rem;
  font-weight: 700;
  color: white;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.stat-label {
  font-size: 0.875rem;
  font-weight: 500;
  opacity: 0.8;
  text-transform: capitalize;
  letter-spacing: 0.5px;
  padding: 0 4px;
  word-break: break-word;
  line-height: 1.3;
  text-align: center;
  color: rgba(var(--v-theme-on-surface), 0.8);
}

/* Actions Container */
.actions-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100%;
  justify-content: center;
}

.action-btn {
  text-transform: none;
  font-weight: 600;
  font-size: 0.875rem;
  padding: 12px 24px;
  border-radius: 25px !important;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  border: none !important;
  letter-spacing: 0.5px;
  min-height: 48px;
}

/* Estilo específico para botão "Marcar Todas" */
.action-btn.v-btn--variant-elevated:not(.v-btn--disabled) {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15), 0 2px 6px rgba(0, 0, 0, 0.1),
    0 0 0 1px rgba(255, 255, 255, 0.1) inset;
}

/* Hover para botões de ação */
.action-btn:hover:not(.v-btn--disabled) {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2), 0 4px 12px rgba(0, 0, 0, 0.15),
    0 0 0 1px rgba(255, 255, 255, 0.15) inset;
}

.action-btn:disabled {
  opacity: 0.5;
  transform: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Remove old styles */
.stats-info,
.stat-divider {
  display: none;
}

/* List Container */
.list-container {
  margin-top: 16px;
}

.todo-list-card {
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 20px;
  overflow: hidden;
}

.v-theme--dark .todo-list-card {
  background: rgb(30, 30, 30);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.todo-list-wrapper {
  padding: 24px;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 80px 24px;
}

.empty-icon {
  margin-bottom: 24px;
  opacity: 0.7;
}

.empty-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: rgba(0, 0, 0, 0.8);
}

.v-theme--dark .empty-title {
  color: rgba(255, 255, 255, 0.8);
}

.empty-subtitle {
  font-size: 1rem;
  opacity: 0.7;
  margin: 0;
  max-width: 400px;
  margin: 0 auto;
  line-height: 1.5;
}

/* Responsive Design */
@media (max-width: 768px) {
  .todos-view {
    padding: 0 8px;
  }

  .header-title {
    font-size: 2rem;
  }

  .header-subtitle {
    font-size: 1rem;
  }

  .stats-container {
    flex-direction: column;
    gap: 20px;
  }

  .stat-item {
    min-width: auto;
    flex: none;
  }

  .stat-circle {
    width: 75px;
    height: 75px;
    margin-bottom: 8px;
  }

  .stat-circle .stat-number {
    font-size: 1.4rem;
  }

  .stat-label {
    font-size: 0.75rem;
    padding: 0 3px;
    line-height: 1.2;
  }

  .actions-container {
    gap: 12px;
  }

  .action-btn {
    font-size: 0.8rem;
    padding: 10px 20px;
  }

  .todo-list-wrapper {
    padding: 16px;
  }

  .empty-state {
    padding: 60px 16px;
  }
}

@media (max-width: 600px) {
  .page-header {
    min-height: 160px;
    border-radius: 16px;
  }

  .header-actions {
    top: 12px;
    left: 12px;
  }

  .form-section {
    margin-bottom: 20px;
  }

  .stats-section {
    margin-top: -10px;
  }

  .stats-container {
    flex-direction: row;
    justify-content: space-between;
    gap: 12px;
  }

  .stat-circle {
    width: 65px;
    height: 65px;
  }

  .stat-circle .stat-number {
    font-size: 1.15rem;
  }

  .stat-label {
    font-size: 0.65rem;
    padding: 0 2px;
    line-height: 1.1;
  }
}

@media (max-width: 480px) {
  .stats-container {
    gap: 8px;
  }

  .stat-circle {
    width: 55px;
    height: 55px;
  }

  .stat-circle .stat-number {
    font-size: 1rem;
  }

  .stat-label {
    font-size: 0.6rem;
    padding: 0 2px;
    line-height: 1.1;
  }
}

/* Glass Effect Enhancement - Removed for cleaner design */
/* Glass effects removed for better visibility and performance */
</style>
