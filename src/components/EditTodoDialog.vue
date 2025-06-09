<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    max-width="600"
    persistent
  >
    <v-card>
      <v-card-title class="text-h5">
        <v-icon left>mdi-pencil</v-icon>
        Editar Tarefa
      </v-card-title>

      <v-card-text>
        <v-form ref="form" v-if="todo">
          <v-text-field
            v-model="editedTodo.text"
            label="Descrição da tarefa"
            variant="outlined"
            :rules="textRules"
            required
            prepend-inner-icon="mdi-text"
            class="mb-4"
          ></v-text-field>

          <v-row>
            <v-col cols="6">
              <v-select
                v-model="editedTodo.priority"
                :items="priorityOptions"
                label="Prioridade"
                variant="outlined"
                prepend-inner-icon="mdi-flag"
              ></v-select>
            </v-col>

            <v-col cols="6">
              <v-select
                v-model="editedTodo.category"
                :items="categoryOptions"
                label="Categoria"
                variant="outlined"
                prepend-inner-icon="mdi-tag"
              ></v-select>
            </v-col>
          </v-row>

          <v-alert v-if="todo.completed" type="info" variant="tonal" class="mt-4">
            <v-icon left>mdi-information</v-icon>
            Esta tarefa está marcada como concluída.
          </v-alert>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="cancel"> Cancelar </v-btn>
        <v-btn
          color="primary"
          variant="elevated"
          @click="save"
          :disabled="!editedTodo.text || !editedTodo.text.trim()"
        >
          <v-icon left>mdi-content-save</v-icon>
          Salvar
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
