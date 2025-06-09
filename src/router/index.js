import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import TodosView from "@/views/TodosView.vue";
import AboutView from "@/views/AboutView.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: HomeView,
    meta: {
      title: "Home - Todo App",
    },
  },
  {
    path: "/todos",
    name: "Todos",
    component: TodosView,
    meta: {
      title: "Todos - Todo App",
    },
  },
  {
    path: "/about",
    name: "About",
    component: AboutView,
    meta: {
      title: "Sobre - Todo App",
    },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    redirect: "/",
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Navigation guard para atualizar o título da página
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || "Todo App";
  next();
});

export default router;
