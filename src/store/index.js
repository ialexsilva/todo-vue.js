import { createStore } from "vuex";
import todos from "./modules/todos";
import ui from "./modules/ui";

export default createStore({
  modules: {
    todos,
    ui,
  },
  strict: process.env.NODE_ENV !== "production",
});
