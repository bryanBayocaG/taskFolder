import { useAuthStore, useColumnStore, useTaskStore } from "./store";

const localStorageClear = () => {
  localStorage.removeItem("column-store");
  localStorage.removeItem("auth-store");
  localStorage.removeItem("theme-store");
  localStorage.removeItem("task-store");
  useAuthStore.getState().currentOff();
  useColumnStore.getState().clearColumns();
  useTaskStore.getState().setTasks([]);
};
export default localStorageClear;
