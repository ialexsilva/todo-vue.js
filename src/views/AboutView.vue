<template>
  <div class="about-view">
    <v-card class="mx-auto" max-width="800">
      <v-card-title class="text-h4 text-center py-8">
        <v-icon left size="large" color="primary">mdi-information</v-icon>
        Sobre o Todo App
      </v-card-title>

      <v-card-text>
        <v-row>
          <v-col cols="12" md="6">
            <h3 class="text-h5 mb-4">📋 Sobre o Projeto</h3>
            <p class="text-body-1 mb-4">
              Este é um aplicativo de gerenciamento de tarefas (Todo App) desenvolvido com Vue.js 3,
              utilizando as melhores práticas e tecnologias modernas.
            </p>

            <h3 class="text-h5 mb-4">🚀 Tecnologias Utilizadas</h3>
            <v-list density="compact">
              <v-list-item v-for="tech in technologies" :key="tech.name" :prepend-icon="tech.icon">
                <v-list-item-title>{{ tech.name }}</v-list-item-title>
                <v-list-item-subtitle>{{ tech.description }}</v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-col>

          <v-col cols="12" md="6">
            <h3 class="text-h5 mb-4">✨ Funcionalidades</h3>
            <v-list density="compact">
              <v-list-item v-for="feature in features" :key="feature" prepend-icon="mdi-check">
                <v-list-item-title>{{ feature }}</v-list-item-title>
              </v-list-item>
            </v-list>

            <h3 class="text-h5 mb-4 mt-6">📱 Design Responsivo</h3>
            <p class="text-body-1">
              O aplicativo foi desenvolvido com design responsivo, adaptando-se perfeitamente a
              diferentes tamanhos de tela, desde dispositivos móveis até desktops.
            </p>
          </v-col>
        </v-row>

        <v-divider class="my-6"></v-divider>

        <div class="text-center">
          <h3 class="text-h5 mb-4">🎯 Objetivo</h3>
          <p class="text-body-1 mb-4">
            Demonstrar a implementação de um aplicativo Vue.js completo, seguindo as melhores
            práticas de desenvolvimento e arquitetura de componentes.
          </p>

          <v-btn color="primary" to="/todos" size="large" variant="elevated">
            <v-icon left>mdi-rocket-launch</v-icon>
            Começar a Usar
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "AboutView",

  data() {
    return {
      technologies: [
        {
          name: "Vue.js 3",
          description: "Framework JavaScript progressivo",
          icon: "mdi-vuejs",
        },
        {
          name: "Vuetify 3",
          description: "Framework de componentes Material Design",
          icon: "mdi-material-design",
        },
        {
          name: "Vuex 4",
          description: "Gerenciamento de estado centralizado",
          icon: "mdi-database",
        },
        {
          name: "Vue Router 4",
          description: "Roteamento oficial para Vue.js",
          icon: "mdi-router-wireless",
        },
        {
          name: "Vite",
          description: "Build tool rápido e moderno",
          icon: "mdi-lightning-bolt",
        },
      ],
      features: [
        "Adicionar, editar e remover tarefas",
        "Marcar tarefas como concluídas",
        "Filtrar tarefas por status",
        "Buscar tarefas por texto",
        "Categorias e prioridades",
        "Armazenamento local (localStorage)",
        "Tema claro e escuro",
        "Interface responsiva",
        "Estatísticas e progresso",
        "Ações em lote (marcar/desmarcar todas)",
      ],
    };
  },
};
</script>

<style scoped>
.about-view {
  min-height: 100vh;
  background: #f8fafc;
  padding: 2rem 1rem;
}
</style>
