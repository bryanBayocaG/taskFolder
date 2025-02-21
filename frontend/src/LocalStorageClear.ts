const localStorageClear = (): void => {
  localStorage.removeItem("column-store");
  localStorage.removeItem("auth-store");
  localStorage.removeItem("theme-store");
  localStorage.removeItem("task-store");
};
export default localStorageClear;
