<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    max-width="650"
    persistent
    class="edit-dialog"
  >
    <v-card class="edit-card" elevation="24" rounded="xl">
      <!-- Header com gradiente roxo -->
      <div class="edit-header">
        <div class="header-content">
          <div class="d-flex align-center">
            <div class="header-icon">
              <v-icon size="28" color="white">mdi-pencil</v-icon>
            </div>
            <div class="header-text">
              <h2 class="text-h5 font-weight-bold text-white mb-0">Editar Tarefa</h2>
              <p class="text-body-2 text-white mb-0" style="opacity: 0.9">
                Modifique os detalhes da sua tarefa
              </p>
            </div>
          </div>
          <v-btn
            icon="mdi-close"
            size="small"
            variant="text"
            color="white"
            @click="cancel"
            class="close-btn"
          ></v-btn>
        </div>
      </div>

      <!-- Conteúdo do formulário -->
      <v-card-text class="edit-content pa-8">
        <v-form ref="form" v-if="todo">
          <!-- Campo de descrição -->
          <div class="field-group mb-6">
            <label class="field-label">Descrição da tarefa</label>
            <v-text-field
              v-model="editedTodo.text"
              variant="outlined"
              :rules="textRules"
              required
              prepend-inner-icon="mdi-format-text"
              class="custom-field"
              placeholder="Digite a descrição da tarefa..."
              hide-details="auto"
              color="primary"
            ></v-text-field>
          </div>

          <!-- Campos de prioridade e categoria -->
          <v-row class="ma-0">
            <v-col cols="12" sm="6" class="px-0 pe-sm-3">
              <div class="field-group">
                <label class="field-label">Prioridade</label>
                <v-select
                  v-model="editedTodo.priority"
                  :items="priorityOptions"
                  variant="outlined"
                  class="custom-field"
                  color="primary"
                  hide-details
                >
                  <template v-slot:prepend-inner>
                    <v-icon :color="getPriorityColor(editedTodo.priority)">
                      {{ getPriorityIcon(editedTodo.priority) }}
                    </v-icon>
                  </template>
                  <template v-slot:item="{ props, item }">
                    <v-list-item v-bind="props">
                      <template v-slot:prepend>
                        <v-icon :color="getPriorityColor(item.value)" class="me-3">
                          {{ getPriorityIcon(item.value) }}
                        </v-icon>
                      </template>
                    </v-list-item>
                  </template>
                </v-select>
              </div>
            </v-col>

            <v-col cols="12" sm="6" class="px-0 ps-sm-3">
              <div class="field-group">
                <label class="field-label">Categoria</label>
                <v-select
                  v-model="editedTodo.category"
                  :items="categoryOptions"
                  variant="outlined"
                  class="custom-field"
                  color="primary"
                  hide-details
                >
                  <template v-slot:prepend-inner>
                    <v-icon :color="getCategoryColor(editedTodo.category)">
                      {{ getCategoryIcon(editedTodo.category) }}
                    </v-icon>
                  </template>
                  <template v-slot:item="{ props, item }">
                    <v-list-item v-bind="props">
                      <template v-slot:prepend>
                        <v-icon :color="getCategoryColor(item.value)" class="me-3">
                          {{ getCategoryIcon(item.value) }}
                        </v-icon>
                      </template>
                    </v-list-item>
                  </template>
                </v-select>
              </div>
            </v-col>
          </v-row>

          <!-- Alert para tarefa concluída -->
          <v-alert
            v-if="todo.completed"
            type="info"
            variant="tonal"
            class="mt-6 custom-alert"
            rounded="lg"
          >
            <template v-slot:prepend>
              <v-icon>mdi-check-circle</v-icon>
            </template>
            <div class="text-body-2">
              <strong>Tarefa Concluída</strong><br />
              Esta tarefa está marcada como concluída.
            </div>
          </v-alert>
        </v-form>
      </v-card-text>

      <!-- Ações do modal -->
      <v-card-actions class="edit-actions pa-8">
        <v-spacer></v-spacer>
        <v-btn
          variant="outlined"
          color="grey-darken-1"
          @click="cancel"
          class="cancel-btn me-4"
          size="x-large"
          rounded="xl"
          elevation="2"
        >
          <v-icon start size="20">mdi-close</v-icon>
          Cancelar
        </v-btn>
        <v-btn
          color="primary"
          variant="elevated"
          @click="save"
          :disabled="!editedTodo.text || !editedTodo.text.trim()"
          class="save-btn"
          size="x-large"
          rounded="xl"
          elevation="8"
        >
          <v-icon start size="20">mdi-content-save</v-icon>
          Salvar Alterações
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "EditTodoDialog",

  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    todo: {
      type: Object,
      default: null,
    },
  },

  emits: ["update:modelValue", "save"],

  data() {
    return {
      editedTodo: {
        id: null,
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
        {
          title: "Alta",
          value: "alta",
        },
        {
          title: "Média",
          value: "media",
        },
        {
          title: "Baixa",
          value: "baixa",
        },
      ],
      categoryOptions: [
        {
          title: "Geral",
          value: "geral",
        },
        {
          title: "Trabalho",
          value: "trabalho",
        },
        {
          title: "Pessoal",
          value: "pessoal",
        },
        {
          title: "Estudos",
          value: "estudos",
        },
        {
          title: "Casa",
          value: "casa",
        },
        {
          title: "Saúde",
          value: "saude",
        },
      ],
    };
  },

  watch: {
    todo: {
      handler(newTodo) {
        if (newTodo) {
          this.editedTodo = { ...newTodo };
        }
      },
      immediate: true,
    },

    modelValue(newValue) {
      if (!newValue) {
        this.resetForm();
      }
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
      return icons[category] || "mdi-circle";
    },

    getPriorityColor(priority) {
      const colors = {
        baixa: "green",
        media: "orange",
        alta: "red",
      };
      return colors[priority] || "grey";
    },

    getPriorityIcon(priority) {
      const icons = {
        baixa: "mdi-arrow-down",
        media: "mdi-equal",
        alta: "mdi-arrow-up",
      };
      return icons[priority] || "mdi-equal";
    },

    async save() {
      const { valid } = await this.$refs.form.validate();

      if (valid && this.editedTodo.text.trim()) {
        this.$emit("save", {
          ...this.editedTodo,
          text: this.editedTodo.text.trim(),
        });
      }
    },

    cancel() {
      this.resetForm();
      this.$emit("update:modelValue", false);
    },

    resetForm() {
      if (this.$refs.form) {
        this.$refs.form.reset();
      }
      if (this.todo) {
        this.editedTodo = { ...this.todo };
      }
    },
  },
};
</script>

<style scoped>
/* Dialog overlay */
.edit-dialog :deep(.v-overlay__scrim) {
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
}

/* Card principal */
.edit-card {
  background: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15), 0 8px 32px rgba(0, 0, 0, 0.1),
    0 4px 16px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  position: relative;
}

/* Header com gradiente roxo */
.edit-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #8b5cf6 100%);
  position: relative;
  overflow: hidden;
}

.edit-header::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.08) 0%, transparent 50%),
    linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.03) 50%, transparent 70%);
  pointer-events: none;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 32px;
  position: relative;
  z-index: 2;
}

.header-icon {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 12px;
  margin-right: 16px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.header-text h2 {
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  letter-spacing: 0.5px;
}

.header-text p {
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.close-btn {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.25);
  transition: all 0.3s ease;
  border-radius: 12px;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Conteúdo do formulário */
.edit-content {
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
}

/* Grupos de campos */
.field-group {
  margin-bottom: 20px;
}

.field-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Campos customizados */
.custom-field :deep(.v-field) {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06), 0 1px 4px rgba(0, 0, 0, 0.04);
  border: 1px solid #e5e7eb;
  transition: all 0.3s ease;
}

.custom-field :deep(.v-field:hover) {
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.1), 0 2px 8px rgba(0, 0, 0, 0.08);
  transform: translateY(-1px);
}

.custom-field :deep(.v-field--focused) {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1), 0 4px 12px rgba(102, 126, 234, 0.15);
  transform: translateY(-1px);
}

.custom-field :deep(.v-field__input) {
  padding: 16px 20px;
  font-size: 15px;
  color: #374151;
}

.custom-field :deep(.v-field__prepend-inner) {
  padding-left: 16px;
  opacity: 1;
}

.custom-field :deep(.v-field__prepend-inner .v-icon) {
  transition: color 0.3s ease;
}

/* Alert customizado */
.custom-alert {
  background: linear-gradient(135deg, #dbeafe 0%, #eff6ff 100%);
  border: 1px solid #3b82f6;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
}

.custom-alert :deep(.v-alert__prepend .v-icon) {
  color: #3b82f6;
}

/* Ações do modal */
.edit-actions {
  background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
  border-top: 1px solid #e5e7eb;
}

/* Botões */
.cancel-btn {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 2px solid #e5e7eb;
  color: #6b7280;
  font-weight: 600;
  letter-spacing: 0.6px;
  text-transform: none;
  font-size: 16px;
  padding: 16px 28px;
  min-width: 160px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08), 0 2px 6px rgba(0, 0, 0, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  position: relative;
  overflow: hidden;
}

.cancel-btn::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.5) 0%, rgba(248, 250, 252, 0.3) 100%);
  pointer-events: none;
  transition: all 0.3s ease;
}

.cancel-btn:hover {
  border-color: #d1d5db;
  background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
  color: #4b5563;
  transform: translateY(-2px) scale(1.01);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12), 0 4px 8px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
}

.cancel-btn:hover::before {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(243, 244, 246, 0.5) 100%);
}

.cancel-btn:active {
  transform: translateY(0) scale(0.98);
  transition: all 0.1s ease;
}

.cancel-btn .v-icon {
  filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.1));
  transition: all 0.3s ease;
}

.cancel-btn:hover .v-icon {
  transform: rotate(-90deg);
}

.save-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #8b5cf6 100%);
  border: none;
  color: white;
  font-weight: 700;
  letter-spacing: 0.8px;
  text-transform: none;
  font-size: 16px;
  padding: 16px 32px;
  min-width: 200px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4), 0 4px 12px rgba(118, 75, 162, 0.3),
    0 2px 8px rgba(139, 92, 246, 0.2);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  position: relative;
  overflow: hidden;
}

.save-btn::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.15) 0%,
      rgba(255, 255, 255, 0.05) 50%,
      transparent 100%
    ),
    radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.2) 0%, transparent 40%);
  pointer-events: none;
}

.save-btn::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
  transition: all 0.6s ease;
  transform: translate(-50%, -50%);
  border-radius: 50%;
}

.save-btn:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 12px 32px rgba(102, 126, 234, 0.5), 0 8px 20px rgba(118, 75, 162, 0.4),
    0 4px 12px rgba(139, 92, 246, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2);
  background: linear-gradient(135deg, #7c85f0 0%, #8456b8 50%, #9d66ff 100%);
}

.save-btn:hover::after {
  width: 300px;
  height: 300px;
}

.save-btn:active {
  transform: translateY(-1px) scale(0.98);
  transition: all 0.1s ease;
}

.save-btn:disabled {
  background: linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%);
  color: #9ca3af;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1);
  transform: none;
  cursor: not-allowed;
}

.save-btn:disabled::before,
.save-btn:disabled::after {
  display: none;
}

.save-btn .v-icon {
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
}

/* Responsividade */
@media (max-width: 600px) {
  .edit-card {
    margin: 16px;
    border-radius: 20px;
  }

  .header-content {
    padding: 20px 24px;
  }

  .edit-content {
    padding: 24px !important;
  }

  .edit-actions {
    padding: 24px !important;
    flex-direction: column;
    gap: 16px;
  }

  .cancel-btn,
  .save-btn {
    width: 100%;
    margin: 0 !important;
    min-width: unset;
    font-size: 16px;
    height: 52px;
  }

  .field-label {
    font-size: 13px;
  }

  .custom-field :deep(.v-field__input) {
    padding: 14px 16px;
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .header-content {
    padding: 16px 20px;
  }

  .header-text h2 {
    font-size: 1.3rem;
  }

  .header-text p {
    font-size: 0.85rem;
  }

  .edit-content {
    padding: 20px !important;
  }

  .edit-actions {
    padding: 20px !important;
  }
}

/* Animações */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.edit-card {
  animation: slideIn 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

/* Dark theme support */
.v-theme--dark .edit-card {
  background: #1e293b;
  border-color: rgba(255, 255, 255, 0.1);
}

.v-theme--dark .edit-content {
  background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%);
}

.v-theme--dark .field-label {
  color: #e2e8f0;
}

.v-theme--dark .custom-field :deep(.v-field) {
  background: #334155;
  border-color: #475569;
}

.v-theme--dark .custom-field :deep(.v-field__input) {
  color: #e2e8f0;
}

.v-theme--dark .edit-actions {
  background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%);
  border-top-color: #475569;
}

.v-theme--dark .cancel-btn {
  background: #334155;
  border-color: #475569;
  color: #cbd5e1;
}

.v-theme--dark .cancel-btn:hover {
  background: #475569;
  border-color: #64748b;
}
</style>
