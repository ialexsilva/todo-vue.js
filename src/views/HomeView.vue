<template>
  <div class="home-view">
    <!-- Header Section Clean -->
    <div class="view-header">
      <div class="header-content">
        <div class="text-center mb-8">
          <div class="header-icon-wrapper mx-auto mb-4">
            <v-icon size="48" color="white">mdi-check-circle</v-icon>
          </div>
          <h1 class="header-title">Bem-vindo ao Todo App</h1>
          <p class="header-subtitle">Organize suas tarefas de forma simples e eficiente</p>
        </div>

        <!-- Estatísticas em círculo -->
        <div class="stats-container">
          <v-row class="justify-center">
            <v-col cols="6" sm="3" v-for="(stat, index) in statsData" :key="index">
              <div
                class="stat-circle"
                :class="{
                  'cursor-pointer': stat.count > 0 || stat.label === 'Progresso',
                  'disabled-stat': stat.count === 0 && stat.label !== 'Progresso',
                }"
                @click="navigateToTodos(stat.filter)"
              >
                <div class="stat-circle-inner" :style="{ background: stat.gradient }">
                  <div class="stat-number">
                    {{ stat.displayValue }}
                  </div>
                  <div class="stat-label">{{ stat.label }}</div>
                </div>
              </div>
            </v-col>
          </v-row>
        </div>
      </div>
    </div>

    <!-- Seção de Tarefas Recentes -->
    <div class="content-section">
      <v-card class="recent-card" elevation="2">
        <div class="card-header">
          <v-card-title class="header-title">
            <div class="d-flex align-center">
              <v-avatar size="48" class="header-avatar me-3">
                <v-icon size="24" color="white">mdi-history</v-icon>
              </v-avatar>
              <div>
                <h3 class="text-h5 font-weight-bold text-white mb-0">Tarefas Recentes</h3>
                <p class="text-caption text-white opacity-80 mb-0">Últimas 5 tarefas criadas</p>
              </div>
            </div>
          </v-card-title>
        </div>

        <v-card-text class="pa-6">
          <div v-if="recentTodos.length === 0" class="empty-state text-center py-8">
            <v-icon size="64" color="grey-lighten-1" class="mb-4">mdi-format-list-checks</v-icon>
            <h3 class="text-h6 mb-2 text-grey-darken-1">Nenhuma tarefa encontrada</h3>
            <p class="text-body-2 text-grey mb-4">Comece criando sua primeira tarefa!</p>
            <v-btn
              color="primary"
              variant="elevated"
              to="/todos"
              class="action-btn"
              prepend-icon="mdi-plus"
            >
              Criar Primeira Tarefa
            </v-btn>
          </div>

          <div v-else class="recent-todos-list">
            <div
              v-for="todo in recentTodos"
              :key="todo.id"
              class="recent-todo-item"
              :class="{ 'completed-item': todo.completed }"
            >
              <div class="d-flex align-center">
                <v-icon :color="todo.completed ? 'success' : 'warning'" class="me-3">
                  {{ todo.completed ? "mdi-check-circle" : "mdi-clock-outline" }}
                </v-icon>

                <div class="flex-grow-1">
                  <div
                    class="todo-text"
                    :class="{ 'text-decoration-line-through text-medium-emphasis': todo.completed }"
                  >
                    {{ todo.text }}
                  </div>
                  <div class="d-flex align-center gap-2 mt-1">
                    <v-chip :color="getPriorityColor(todo.priority)" size="x-small" variant="tonal">
                      {{ getPriorityLabel(todo.priority) }}
                    </v-chip>
                    <span class="text-caption text-medium-emphasis">
                      {{ formatDate(todo.createdAt) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </v-card-text>
      </v-card>

      <!-- Botão de Ação -->
      <div class="action-section mt-4">
        <v-row class="justify-center">
          <v-col cols="auto">
            <v-btn
              color="primary"
              size="large"
              to="/todos"
              variant="elevated"
              class="action-btn"
              prepend-icon="mdi-format-list-checks"
            >
              Gerenciar Tarefas
            </v-btn>
          </v-col>
        </v-row>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "HomeView",

  computed: {
    ...mapGetters({
      allTodos: "todos/allTodos",
      activeTodosCount: "todos/activeTodosCount",
      completedTodosCount: "todos/completedTodosCount",
      totalTodosCount: "todos/totalTodosCount",
    }),

    totalTodos() {
      return this.totalTodosCount;
    },

    activeTodos() {
      return this.activeTodosCount;
    },

    completedTodos() {
      return this.completedTodosCount;
    },

    completionPercentage() {
      if (this.totalTodos === 0) return 0;
      const percentage = Math.round((this.completedTodos / this.totalTodos) * 100);
      return Math.min(100, Math.max(0, percentage)); // Garante que seja entre 0 e 100
    },

    statsData() {
      return [
        {
          count: this.totalTodos,
          label: "Total",
          filter: "all",
          gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          displayValue: this.totalTodos.toString(),
        },
        {
          count: this.activeTodos,
          label: "Pendentes",
          filter: "pending",
          gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
          displayValue: this.activeTodos.toString(),
        },
        {
          count: this.completedTodos,
          label: "Concluídas",
          filter: "completed",
          gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
          displayValue: this.completedTodos.toString(),
        },
        {
          count: this.completionPercentage,
          label: "Progresso",
          filter: "all",
          gradient: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
          displayValue: `${this.completionPercentage}%`,
        },
      ];
    },

    recentTodos() {
      return [...this.allTodos]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
    },
  },

  methods: {
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
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

    navigateToTodos(filter) {
      // Só navega se houver tarefas relevantes
      if (filter === "all" && this.totalTodos === 0) {
        this.$store.dispatch("ui/showSnackbar", {
          message: "Nenhuma tarefa encontrada. Adicione uma nova tarefa!",
          color: "info",
        });
        return;
      }
      if (filter === "pending" && this.activeTodos === 0) {
        this.$store.dispatch("ui/showSnackbar", {
          message: "Nenhuma tarefa pendente encontrada!",
          color: "info",
        });
        return;
      }
      if (filter === "completed" && this.completedTodos === 0) {
        this.$store.dispatch("ui/showSnackbar", {
          message: "Nenhuma tarefa concluída encontrada!",
          color: "info",
        });
        return;
      }

      // Navega para a página de tarefas com query parameters para aplicar filtros
      this.$router.push({
        path: "/todos",
        query: { filter },
      });
    },
  },
};
</script>

<style scoped>
.home-view {
  min-height: 100vh;
  background: #f8fafc;
  padding: 1.5rem 1rem;
}

/* Header Section Clean */
.view-header {
  max-width: 1200px;
  margin: 0 auto 2rem auto;
}

.header-content {
  text-align: center;
}

.header-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
}

.header-title {
  font-size: 3rem;
  font-weight: 700;
  color: #1e293b;
  margin: 1rem 0 0.5rem 0;
  line-height: 1.2;
}

.header-subtitle {
  font-size: 1.25rem;
  color: #64748b;
  margin: 0;
  font-weight: 400;
}

/* Statistics Container */
.stats-container {
  margin-top: 2rem;
}

.stat-circle {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.stat-circle:hover {
  transform: translateY(-8px);
}

.cursor-pointer {
  cursor: pointer;
}

.disabled-stat {
  opacity: 0.6;
  cursor: not-allowed;
}

.disabled-stat:hover {
  transform: none !important;
}

.stat-circle-inner {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  border: 3px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.stat-circle:hover .stat-circle-inner {
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
  transform: scale(1.05);
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 800;
  line-height: 1;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.875rem;
  font-weight: 600;
  text-align: center;
  opacity: 0.95;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 0 8px;
  word-break: break-word;
  line-height: 1.3;
}

/* Content Section */
.content-section {
  max-width: 1000px;
  margin: 0 auto;
}

/* Recent Card */
.recent-card {
  border-radius: 20px;
  overflow: hidden;
  border: none;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  background: white;
}

.card-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px 20px 0 0;
  overflow: hidden;
  margin: 0;
}

.header-title {
  padding: 20px;
  margin: 0;
}

.header-avatar {
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
}

/* Recent Todos List */
.recent-todos-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.recent-todo-item {
  padding: 16px 0;
  border-bottom: 1px solid #e2e8f0;
  transition: all 0.3s ease;
}

.recent-todo-item:last-child {
  border-bottom: none;
}

.recent-todo-item:hover {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.02) 0%, rgba(118, 75, 162, 0.02) 100%);
  border-radius: 12px;
  margin: 0 -12px;
  padding: 16px 12px;
}

.completed-item {
  opacity: 0.7;
}

.todo-text {
  font-weight: 600;
  font-size: 1.1rem;
  line-height: 1.4;
  margin-bottom: 6px;
  color: #1e293b;
}

.gap-2 {
  gap: 8px;
}

/* Empty State */
.empty-state {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.03) 0%, rgba(118, 75, 162, 0.03) 100%);
  border-radius: 20px;
  border: 2px dashed rgba(102, 126, 234, 0.2);
  padding: 2rem 1.5rem;
}

/* Action Buttons */
.action-btn {
  border-radius: 25px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-transform: none;
  font-weight: 600;
  font-size: 1.1rem;
  letter-spacing: 0.5px;
  min-height: 54px;
  padding: 0 2rem;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3), 0 2px 6px rgba(0, 0, 0, 0.12),
    0 0 0 1px rgba(255, 255, 255, 0.1) inset;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.action-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 30px rgba(102, 126, 234, 0.4), 0 4px 12px rgba(0, 0, 0, 0.15),
    0 0 0 1px rgba(255, 255, 255, 0.15) inset;
}

/* Responsive Design */
@media (max-width: 768px) {
  .home-view {
    padding: 1rem 1rem;
  }

  .header-title {
    font-size: 2.5rem;
  }

  .header-subtitle {
    font-size: 1.1rem;
  }

  .header-icon-wrapper {
    width: 70px;
    height: 70px;
  }

  .stat-circle-inner {
    width: 125px;
    height: 125px;
  }

  .stat-number {
    font-size: 1.8rem;
  }

  .stat-label {
    font-size: 0.75rem;
    padding: 0 6px;
    line-height: 1.2;
  }

  .header-title {
    padding: 16px;
  }

  .header-avatar {
    width: 44px;
    height: 44px;
  }
}

@media (max-width: 600px) {
  .home-view {
    padding: 0.75rem 0.5rem;
  }

  .header-title {
    font-size: 2rem;
  }

  .header-subtitle {
    font-size: 1rem;
  }

  .header-icon-wrapper {
    width: 60px;
    height: 60px;
  }

  .stat-circle-inner {
    width: 110px;
    height: 110px;
  }

  .stat-number {
    font-size: 1.6rem;
  }

  .stat-label {
    font-size: 0.7rem;
    line-height: 1.2;
    padding: 0 8px;
    word-break: break-word;
  }
}

@media (max-width: 480px) {
  .header-title {
    font-size: 1.8rem;
  }

  .header-subtitle {
    font-size: 0.95rem;
  }

  .stat-circle-inner {
    width: 100px;
    height: 100px;
  }

  .stat-number {
    font-size: 1.4rem;
  }

  .stat-label {
    font-size: 0.65rem;
    line-height: 1.2;
    padding: 0 6px;
  }
}

@media (max-width: 390px) {
  .header-title {
    font-size: 1.6rem;
  }

  .header-subtitle {
    font-size: 0.9rem;
  }

  .stat-circle-inner {
    width: 95px;
    height: 95px;
  }

  .stat-number {
    font-size: 1.3rem;
  }

  .stat-label {
    font-size: 0.6rem;
    line-height: 1.2;
    padding: 0 4px;
    word-break: break-word;
  }
}

@media (max-width: 320px) {
  .header-title {
    font-size: 1.4rem;
  }

  .header-subtitle {
    font-size: 0.85rem;
  }

  .stat-circle-inner {
    width: 85px;
    height: 85px;
  }

  .stat-number {
    font-size: 1.1rem;
  }

  .stat-label {
    font-size: 0.55rem;
    line-height: 1.1;
    padding: 0 3px;
    word-break: break-word;
  }
}

/* Clean Header Design - No Dark Background */

/* Clean Statistics Design */

/* Clean Content Section */

/* Clean Responsive Design */
</style>
