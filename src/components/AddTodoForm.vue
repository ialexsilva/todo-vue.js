<template>
  <v-card class="add-todo-card" elevation="2">
    <div class="card-header">
      <v-card-title class="header-title">
        <div class="d-flex align-center">
          <v-avatar size="48" class="header-avatar me-3">
            <v-icon size="24" color="white">mdi-plus-circle</v-icon>
          </v-avatar>
          <div>
            <h3 class="text-h5 font-weight-bold text-white mb-0">Nova Tarefa</h3>
            <p class="text-caption text-white opacity-80 mb-0">
              Adicione uma nova tarefa à sua lista
            </p>
          </div>
        </div>
      </v-card-title>
    </div>

    <v-card-text class="pa-6">
      <v-form @submit.prevent="addTodo" ref="form">
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="newTodo.text"
              label="Descrição da tarefa"
              placeholder="O que você precisa fazer hoje?"
              variant="outlined"
              :rules="textRules"
              required
              prepend-inner-icon="mdi-text"
              class="todo-input"
              color="primary"
              bg-color="white"
              hide-details="auto"
            >
              <template v-slot:append-inner>
                <v-icon v-if="newTodo.text" color="success" size="small"> mdi-check-circle </v-icon>
              </template>
            </v-text-field>
          </v-col>
        </v-row>

        <v-row class="mt-2">
          <v-col cols="12" sm="6" md="4">
            <v-select
              v-model="newTodo.priority"
              :items="priorityOptions"
              label="Prioridade"
              variant="outlined"
              prepend-inner-icon="mdi-flag"
              class="priority-select"
              color="primary"
              bg-color="white"
              hide-details
            >
              <template v-slot:selection="{ item }">
                <div class="d-flex align-center">
                  <v-chip :color="getPriorityColor(item.value)" size="small" class="me-2">
                    {{ item.title }}
                  </v-chip>
                </div>
              </template>

              <template v-slot:item="{ props, item }">
                <v-list-item v-bind="props">
                  <template v-slot:prepend>
                    <v-chip :color="getPriorityColor(item.value)" size="small" class="me-2">
                      {{ item.title }}
                    </v-chip>
                  </template>
                </v-list-item>
              </template>
            </v-select>
          </v-col>

          <v-col cols="12" sm="6" md="4">
            <v-select
              v-model="newTodo.category"
              :items="categoryOptions"
              label="Categoria"
              variant="outlined"
              prepend-inner-icon="mdi-tag"
              class="category-select"
              color="primary"
              bg-color="white"
              hide-details
            >
              <template v-slot:selection="{ item }">
                <div class="d-flex align-center">
                  <v-icon :color="getCategoryColor(item.value)" size="small" class="me-2">
                    {{ getCategoryIcon(item.value) }}
                  </v-icon>
                  {{ item.title }}
                </div>
              </template>

              <template v-slot:item="{ props, item }">
                <v-list-item v-bind="props">
                  <template v-slot:prepend>
                    <v-icon :color="getCategoryColor(item.value)" size="small">
                      {{ getCategoryIcon(item.value) }}
                    </v-icon>
                  </template>
                </v-list-item>
              </template>
            </v-select>
          </v-col>

          <v-col cols="12" md="4" class="d-flex align-end">
            <v-btn
              type="submit"
              variant="elevated"
              size="large"
              :disabled="!newTodo.text || !newTodo.text.trim()"
              class="add-btn flex-grow-1"
              :loading="loading"
              prepend-icon="mdi-plus-circle"
            >
              Adicionar
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "AddTodoForm",

  emits: ["todo-added"],

  data() {
    return {
      newTodo: {
        text: "",
        priority: "media",
        category: "geral",
      },
      textRules: [
        (v) => !!v || "Descrição é obrigatória",
        (v) => (v && v.length >= 3) || "Descrição deve ter pelo menos 3 caracteres",
        (v) => (v && v.length <= 100) || "Descrição deve ter no máximo 100 caracteres",
      ],
      priorityOptions: [
        { title: "Alta", value: "alta" },
        { title: "Média", value: "media" },
        { title: "Baixa", value: "baixa" },
      ],
      categoryOptions: [
        { title: "Geral", value: "geral" },
        { title: "Trabalho", value: "trabalho" },
        { title: "Pessoal", value: "pessoal" },
        { title: "Estudos", value: "estudos" },
        { title: "Casa", value: "casa" },
        { title: "Saúde", value: "saude" },
      ],
    };
  },

  methods: {
    ...mapActions({
      addTodoAction: "todos/addTodo",
    }),

    async addTodo() {
      const { valid } = await this.$refs.form.validate();

      if (valid && this.newTodo.text.trim()) {
        this.addTodoAction({
          text: this.newTodo.text.trim(),
          priority: this.newTodo.priority,
          category: this.newTodo.category,
        });

        this.newTodo = {
          text: "",
          priority: "media",
          category: "geral",
        };

        this.$refs.form.reset();
        this.$emit("todo-added");
      }
    },

    getPriorityColor(priority) {
      const colors = {
        alta: "error",
        media: "warning",
        baixa: "success",
      };
      return colors[priority] || "grey";
    },

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
  },
};
</script>

<style scoped>
.add-todo-card {
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.card-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.header-title {
  padding: 24px;
}

.header-avatar {
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.todo-input {
  margin-bottom: 16px;
}

.todo-input .v-field {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.todo-input .v-field:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.todo-input .v-field--focused {
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
}

.priority-select .v-field,
.category-select .v-field {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.priority-select .v-field:hover,
.category-select .v-field:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.add-btn {
  border-radius: 24px;
  background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
  color: white;
  text-transform: none;
  font-weight: 600;
  font-size: 1rem;
  letter-spacing: 0.5px;
  min-height: 48px;
  box-shadow: 0 2px 8px rgba(76, 175, 80, 0.25), 0 1px 3px rgba(0, 0, 0, 0.12),
    0 0 0 1px rgba(255, 255, 255, 0.1) inset;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.add-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(76, 175, 80, 0.35), 0 2px 6px rgba(0, 0, 0, 0.15),
    0 0 0 1px rgba(255, 255, 255, 0.15) inset;
  background: linear-gradient(135deg, #45a049 0%, #3d8b40 100%);
}

.add-btn:disabled {
  opacity: 0.5;
  transform: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  background: #ccc;
}

/* Responsive */
@media (max-width: 768px) {
  .header-title {
    padding: 16px;
  }

  .header-avatar {
    width: 40px;
    height: 40px;
  }

  .add-btn {
    margin-top: 16px;
  }
}
</style>
