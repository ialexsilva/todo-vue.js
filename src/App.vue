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
    <v-app-bar
      elevation="0"
      :height="$vuetify.display.mobile ? 64 : 70"
      class="app-bar-gradient"
      density="comfortable"
    >
      <template v-slot:prepend>
        <v-app-bar-nav-icon
          @click="handleMenuClick"
          class="nav-icon"
          color="white"
        ></v-app-bar-nav-icon>
      </template>

      <v-toolbar-title class="toolbar-title-container">
        <div class="title-content">
          <v-icon :size="$vuetify.display.mobile ? 24 : 28" color="white" class="app-icon">
            mdi-check-circle
          </v-icon>
          <span
            class="font-weight-bold text-white app-title"
            :class="$vuetify.display.mobile ? 'text-h6' : 'text-h5'"
          >
            Todo App
          </span>
        </div>
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

/* Sidebar - Purple Gradient to Match App Bar */
.sidebar-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #8b5cf6 100%);
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.25), 0 4px 16px rgba(118, 75, 162, 0.15);
  height: 100vh !important;
  position: relative;
  overflow: hidden;
}

.sidebar-gradient::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 10% 20%, rgba(255, 255, 255, 0.08) 0%, transparent 40%),
    radial-gradient(circle at 90% 80%, rgba(255, 255, 255, 0.06) 0%, transparent 40%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.03) 0%, transparent 50%);
  pointer-events: none;
}

/* Sidebar Header */
.sidebar-header {
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  margin-bottom: 16px;
  position: relative;
  z-index: 2;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Gradient Avatar */
.gradient-avatar {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.15) 100%);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
}

.gradient-avatar:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.4);
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
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  border-radius: 8px;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* App Bar - Beautiful Purple Gradient Design */
.app-bar-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #8b5cf6 100%) !important;
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.25), 0 4px 16px rgba(118, 75, 162, 0.15),
    0 2px 8px rgba(139, 92, 246, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.15);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
  min-height: 64px !important;
  display: flex !important;
  align-items: center !important;
}

/* Altura específica para mobile */
@media (max-width: 960px) {
  .app-bar-gradient {
    height: 64px !important;
    min-height: 64px !important;
    padding: 0 8px !important;
  }

  .toolbar-title-container {
    padding: 8px 0;
  }

  .nav-icon {
    margin: 8px;
    width: 44px !important;
    height: 44px !important;
  }

  .app-title {
    font-size: 1.25rem !important;
    line-height: 1.2;
  }

  .title-content {
    gap: 4px !important;
  }
}

/* Altura para desktop */
@media (min-width: 961px) {
  .app-bar-gradient {
    height: 70px !important;
    min-height: 70px !important;
  }
}

.app-bar-gradient::before {
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

/* Garantir que a v-app-bar seja sempre roxa */
.v-app-bar.app-bar-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #8b5cf6 100%) !important;
  display: flex !important;
  align-items: center !important;
}

/* Forçar no tema claro também */
.v-theme--light .v-app-bar.app-bar-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #8b5cf6 100%) !important;
}

/* Alinhamento específico do conteúdo do app bar */
.app-bar-gradient .v-toolbar__content {
  display: flex !important;
  align-items: center !important;
  height: 100% !important;
}

.app-bar-gradient .v-toolbar-title {
  display: flex !important;
  align-items: center !important;
  height: 100% !important;
}

.app-bar-gradient .v-app-bar-nav-icon {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

.nav-icon {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2);
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

.nav-icon:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: scale(1.05) translateY(-1px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.3);
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

/* App Bar Title Styling */
.toolbar-title-container {
  display: flex !important;
  align-items: center !important;
  height: 100% !important;
  padding: 0 !important;
  margin: 0 !important;
}

.title-content {
  display: flex !important;
  align-items: center !important;
  gap: 8px !important;
  height: 100% !important;
  margin-left: 8px !important;
}

.app-icon {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  transition: all 0.3s ease;
  margin: 0 !important;
}

.app-icon:hover {
  transform: rotate(360deg) scale(1.1);
}

.app-title {
  display: flex !important;
  align-items: center !important;
  transition: all 0.3s ease;
  line-height: 1 !important;
  margin: 0 !important;
  padding: 0 !important;
}

.app-title:hover {
  transform: translateY(-1px);
  text-shadow: 0 3px 6px rgba(0, 0, 0, 0.3), 0 1px 3px rgba(0, 0, 0, 0.2),
    0 0 8px rgba(255, 255, 255, 0.3);
}

@keyframes iconGlow {
  0% {
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2)) drop-shadow(0 0 8px rgba(255, 255, 255, 0.2));
  }
  100% {
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2)) drop-shadow(0 0 12px rgba(255, 255, 255, 0.4));
  }
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

  .v-app-bar {
    height: 64px !important;
  }

  .v-toolbar-title span {
    font-size: 1.1rem;
  }

  .v-toolbar-title .v-icon {
    font-size: 24px;
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

  .v-toolbar-title span {
    font-size: 1rem;
  }

  .v-toolbar-title .v-icon {
    font-size: 20px;
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

/* Enhanced ripple effect */
.v-app-bar .v-btn--icon:hover {
  background: rgba(255, 255, 255, 0.08) !important;
}
</style>
