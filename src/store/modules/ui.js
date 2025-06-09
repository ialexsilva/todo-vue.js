// Estado para gerenciar UI
const state = {
  theme: localStorage.getItem("theme") || "light",
  sidebarOpen: false,
  loading: false,
  snackbar: {
    show: false,
    message: "",
    color: "success",
    timeout: 3000,
  },
};

const getters = {
  theme: (state) => state.theme,
  sidebarOpen: (state) => state.sidebarOpen,
  loading: (state) => state.loading,
  snackbar: (state) => state.snackbar,
};

const mutations = {
  SET_THEME(state, theme) {
    state.theme = theme;
    localStorage.setItem("theme", theme);
  },

  TOGGLE_SIDEBAR(state) {
    state.sidebarOpen = !state.sidebarOpen;
  },

  SET_SIDEBAR(state, isOpen) {
    state.sidebarOpen = isOpen;
  },

  SET_LOADING(state, loading) {
    state.loading = loading;
  },

  SHOW_SNACKBAR(state, { message, color = "success", timeout = 3000 }) {
    state.snackbar = {
      show: true,
      message,
      color,
      timeout,
    };
  },

  HIDE_SNACKBAR(state) {
    state.snackbar.show = false;
  },
};

const actions = {
  toggleTheme({ commit, state }) {
    const newTheme = state.theme === "light" ? "dark" : "light";
    commit("SET_THEME", newTheme);
  },

  setTheme({ commit }, theme) {
    commit("SET_THEME", theme);
  },

  toggleSidebar({ commit }) {
    commit("TOGGLE_SIDEBAR");
  },

  setSidebar({ commit }, isOpen) {
    commit("SET_SIDEBAR", isOpen);
  },

  setLoading({ commit }, loading) {
    commit("SET_LOADING", loading);
  },

  showSnackbar({ commit }, payload) {
    commit("SHOW_SNACKBAR", payload);
  },

  hideSnackbar({ commit }) {
    commit("HIDE_SNACKBAR");
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
