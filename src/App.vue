<template>
  <v-app :theme="theme">
    <!-- Navigation Drawer -->
    <v-navigation-drawer
      v-model="sidebarOpen"
      temporary
      :width="$vuetify.display.mobile ? 280 : 320"
      class="sidebar-gradient"
      location="left"
      elevation="4"
    >
      <!-- Header with close button -->
      <div class="sidebar-header pa-4">
        <div class="d-flex align-center justify-space-between">
          <div class="d-flex align-center">
            <v-avatar size="50" class="gradient-avatar me-3">
              <v-icon size="24" color="white">mdi-check-circle-outline</v-icon>
            </v-avatar>
            <div>
              <div class="text-h6 font-weight-bold text-white">Todo App</div>
              <div class="text-caption text-white" style="opacity: 0.8">Organize suas tarefas</div>
            </div>
          </div>
          <v-btn
            icon="mdi-close"
            size="small"
            variant="text"
            color="white"
            @click="closeSidebar"
            class="close-btn"
          ></v-btn>
        </div>
      </div>

      <!-- Navigation Items -->
      <v-list class="nav-list pa-0" nav density="compact">
        <v-list-item
          v-for="item in navigationItems"
          :key="item.title"
          :prepend-icon="item.icon"
          :title="item.title"
          :to="item.to"
          color="white"
          @click="handleNavigation"
          class="nav-item mx-3 my-1"
          :class="{ 'active-nav': $route.path === item.to }"
          rounded="lg"
        ></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- App Bar -->
    <v-app-bar elevation="0" height="70" class="app-bar-gradient">
      <v-app-bar-nav-icon
        @click="handleMenuClick"
        class="nav-icon"
        color="white"
      ></v-app-bar-nav-icon>

      <v-toolbar-title class="d-flex align-center">
        <v-icon left size="28" color="white" class="me-3">mdi-check-circle</v-icon>
        <span class="text-h5 font-weight-bold text-white">Todo App</span>
      </v-toolbar-title>

      <v-spacer></v-spacer>
    </v-app-bar>

    <!-- Main Content -->
    <v-main class="main-content">
      <div class="content-background"></div>
      <v-container fluid class="pa-6">
        <router-view />
      </v-container>
    </v-main>

    <!-- Loading Overlay -->
    <v-overlay v-model="loading" class="align-center justify-center">
      <v-progress-circular color="primary" indeterminate size="64"></v-progress-circular>
    </v-overlay>

    <!-- Snackbar for notifications -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="snackbar.timeout"
      location="bottom right"
      variant="elevated"
      class="custom-snackbar"
      rounded="pill"
    >
      <div class="d-flex align-center">
        <v-icon left class="me-2">
          {{
            snackbar.color === "success"
              ? "mdi-check-circle"
              : snackbar.color === "error"
              ? "mdi-alert-circle"
              : "mdi-information"
          }}
        </v-icon>
        {{ snackbar.message }}
      </div>

      <template v-slot:actions>
        <v-btn color="white" variant="text" @click="hideSnackbar" size="small" icon>
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "App",

  data() {
    return {
      navigationItems: [
        {
          title: "Home",
          icon: "mdi-home",
          to: "/",
        },
        {
          title: "Tarefas",
          icon: "mdi-format-list-checks",
          to: "/todos",
        },
        {
          title: "Sobre",
          icon: "mdi-information",
          to: "/about",
        },
      ],
    };
  },

  computed: {
    ...mapGetters({
      theme: "ui/theme",
      sidebarOpen: "ui/sidebarOpen",
      loading: "ui/loading",
      snackbar: "ui/snackbar",
    }),

    debugSidebarOpen() {
      console.log("Sidebar state changed:", this.sidebarOpen);
      return this.sidebarOpen;
    },
  },

  methods: {
    ...mapActions({
      toggleTheme: "ui/toggleTheme",
      toggleSidebar: "ui/toggleSidebar",
      hideSnackbar: "ui/hideSnackbar",
      setSidebar: "ui/setSidebar",
    }),

    closeSidebar() {
      this.setSidebar(false);
    },

    handleMenuClick() {
      console.log("Menu clicked, current sidebar state:", this.sidebarOpen);
      this.toggleSidebar();
      console.log("New sidebar state:", this.sidebarOpen);
    },

    handleNavigation() {
      // Fecha a sidebar após navegação
      this.setSidebar(false);
    },

    handleClickOutside(event) {
      // Só funciona em dispositivos móveis quando a sidebar está aberta
      if (!this.sidebarOpen || !this.$vuetify.display.mobile) return;

      // Verifica se o clique foi fora da sidebar
      const sidebar = document.querySelector(".v-navigation-drawer");
      const menuButton = document.querySelector(".v-app-bar-nav-icon");

      if (
        sidebar &&
        !sidebar.contains(event.target) &&
        menuButton &&
        !menuButton.contains(event.target)
      ) {
        this.setSidebar(false);
      }
    },

    handleEscKey(event) {
      if (event.key === "Escape" && this.sidebarOpen) {
        this.setSidebar(false);
      }
    },
  },

  mounted() {
    // Adiciona listener para cliques fora da sidebar
    document.addEventListener("click", this.handleClickOutside);
    // Adiciona listener para tecla ESC
    document.addEventListener("keydown", this.handleEscKey);
  },

  beforeUnmount() {
    // Remove listeners ao destruir o componente
    document.removeEventListener("click", this.handleClickOutside);
    document.removeEventListener("keydown", this.handleEscKey);
  },

  watch: {
    theme: {
      handler(newTheme) {
        this.$vuetify.theme.global.name = newTheme;
      },
      immediate: true,
    },

    sidebarOpen: {
      handler(newValue) {
        console.log("Sidebar watch triggered:", newValue);
      },
      immediate: true,
    },
  },
};
</script>

<style scoped>
.v-app {
  font-family: "Inter", "Roboto", sans-serif;
}

/* Sidebar Gradient */
.sidebar-gradient {
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  height: 100vh !important;
}

/* Sidebar Header */
.sidebar-header {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 16px;
}

/* Gradient Avatar */
.gradient-avatar {
  background: linear-gradient(135deg, #ff6b6b 0%, #feca57 100%);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Navigation Items */
.nav-list {
  background: transparent !important;
}

.nav-item {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  backdrop-filter: blur(10px);
  color: white !important;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.15) !important;
  transform: translateX(4px);
}

.nav-item.active-nav {
  background: rgba(255, 255, 255, 0.95) !important;
  color: var(--v-primary-base) !important;
  transform: translateX(8px);
}

.nav-item.active-nav .v-list-item-title {
  color: var(--v-primary-base) !important;
  font-weight: bold;
}

.nav-item .v-list-item-title {
  color: white !important;
}

.close-btn {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* App Bar Gradient - Forçar preto em ambos os temas */
.app-bar-gradient {
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%) !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

/* Garantir que a v-app-bar seja sempre preta */
.v-app-bar.app-bar-gradient {
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%) !important;
}

/* Forçar no tema claro também */
.v-theme--light .v-app-bar.app-bar-gradient {
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%) !important;
}

.nav-icon {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.nav-icon:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.05);
}

.theme-btn {
  border: 1px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.theme-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: scale(1.05);
}

/* Main Content */
.main-content {
  position: relative;
  min-height: 100vh;
}

/* Container transparente */
.v-container {
  background: #f8fafc;
}

.content-background {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #f8fafc;
  z-index: -1;
}

/* Dark theme background */
.v-theme--dark .content-background {
  background: linear-gradient(135deg, #232526 0%, #414345 100%);
}

/* Custom Snackbar */
.custom-snackbar {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

/* Transparent class */
.transparent {
  background: transparent !important;
}

/* Animation for route transitions */
.v-main {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .nav-item {
    margin: 2px 8px;
  }

  .sidebar-header {
    padding: 16px !important;
  }

  .nav-list {
    padding: 0 8px !important;
  }

  .v-navigation-drawer {
    max-width: 280px !important;
  }
}

@media (max-width: 480px) {
  .v-navigation-drawer {
    max-width: 260px !important;
  }

  .sidebar-header {
    padding: 12px !important;
  }

  .nav-item {
    margin: 1px 6px;
  }
}

/* Scrollbar styling */
.v-navigation-drawer ::-webkit-scrollbar {
  width: 4px;
}

.v-navigation-drawer ::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
}

.v-navigation-drawer ::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
}

.v-navigation-drawer ::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}
</style>
