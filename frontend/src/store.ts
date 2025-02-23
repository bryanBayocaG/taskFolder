import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Column, ID, Task } from "./type";
import { arrayMove } from "@dnd-kit/sortable";
import { backEndBaseURL } from "./utils/baseUrl";

type AuthStore = {
  currentAuth: boolean;
  currentAuthId: string;
  currentAuthImg: string | null;
  currentAuthEmail: string | null;
  currentAuthDisplayName: string | null;
  currentOff: () => void;
  currentOn: (
    id: string,
    img: string | null,
    email: string | null,
    name: string | null
  ) => void;
};

type ThemeStore = {
  theme: string;
  themeSet: (settedTheme: string) => void;
};

type ColumnStore = {
  columns: Column[];
  setColumns: (columns: Column[]) => void;
  addColumn: (column: Column) => void;
  updateColumn: (id: ID, title: string) => void;
  deleteColumn: (id: ID) => void;
  moveColumn: (activeColumnID: ID, overColumnID: ID) => void;
  clearColumns: () => void;
};

type TaskStore = {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  moveTask: (
    activeTaskID: ID,
    overTaskID: ID,
    isActiveTask: boolean,
    isOverTask: boolean,
    isOverColumn: boolean
  ) => void;
};

export const useAuthStore = create<AuthStore, [["zustand/persist", AuthStore]]>(
  persist(
    (set) => ({
      currentAuth: false,
      currentAuthId: "",
      currentAuthImg: "",
      currentAuthEmail: "",
      currentAuthDisplayName: "",
      currentOff: () => {
        set({
          currentAuth: false,
          currentAuthId: "",
          currentAuthImg: "",
          currentAuthEmail: "",
          currentAuthDisplayName: "",
        });
      },
      currentOn: (id, img, email, name) => {
        set({
          currentAuth: true,
          currentAuthId: id,
          currentAuthImg: img,
          currentAuthEmail: email,
          currentAuthDisplayName: name,
        });
      },
    }),
    {
      name: "auth-store",
    }
  )
);

export const useThemeStore = create<
  ThemeStore,
  [["zustand/persist", ThemeStore]]
>(
  persist(
    (set) => ({
      theme: "dark",
      themeSet: (settedTheme) => {
        set({ theme: settedTheme });
      },
    }),
    {
      name: "theme-store",
    }
  )
);

export const useColumnStore = create<
  ColumnStore,
  [["zustand/persist", ColumnStore]]
>(
  persist(
    (set) => ({
      columns: [],
      setColumns: (newColumns) => set({ columns: newColumns }),

      addColumn: (column) =>
        set((state) => ({ columns: [...state.columns, column] })),

      updateColumn: (id, title) =>
        set((state) => ({
          columns: state.columns.map((col) =>
            col.id === id ? { ...col, title } : col
          ),
        })),

      deleteColumn: (id) =>
        set((state) => ({
          columns: state.columns.filter((col) => col.id !== id),
        })),

      moveColumn: async (activeColumnID, overColumnID) => {
        set((state) => {
          const activeIndex = state.columns.findIndex(
            (col) => col.id === activeColumnID
          );
          const overIndex = state.columns.findIndex(
            (col) => col.id === overColumnID
          );

          if (activeIndex === -1 || overIndex === -1) return state; // Prevent errors

          const updatedColumns = arrayMove(
            state.columns,
            activeIndex,
            overIndex
          ).map((col, index) => ({ ...col, position: index }));
          //wala kinalaman ang map, ing change ko lang value ng position

          const reOderColumns = async () => {
            const res = await fetch(`${backEndBaseURL}/api/column/reorder`, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                columns: updatedColumns,
              }),
            });
            if (!res.ok) {
              console.log("request to move not happen");
              return state;
            }
          };
          reOderColumns();
          return { columns: updatedColumns };
        });
      },
      clearColumns: () => set({ columns: [] }),
    }),
    {
      name: "column-store",
    }
  )
);

export const useTaskStore = create<TaskStore, [["zustand/persist", TaskStore]]>(
  persist(
    (set) => ({
      tasks: [],
      setTasks: (newTasks) => set({ tasks: newTasks }),
      addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),

      moveTask: (
        activeTaskID,
        overTaskID,
        isActiveTask,
        isOverTask,
        isOverColumn
      ) =>
        set((state) => {
          // const activeIndex = state.tasks.findIndex(
          //   (t) => t.id === activeTaskID
          // );
          // if (activeIndex === -1) return {};

          // // Dropping task over another task
          // if (isActiveTask && isOverTask) {
          //   const overIndex = state.tasks.findIndex((t) => t.id === overTaskID);
          //   if (overIndex === -1) return {};

          //   state.tasks[activeIndex].columnID = state.tasks[overIndex].columnID;
          //   return {
          //     tasks: arrayMove(state.tasks, activeIndex, overIndex),
          //   };
          // }

          // // Dropping task into a column
          // if (isActiveTask && isOverColumn) {
          //   state.tasks[activeIndex].columnID = overTaskID;
          //   return {
          //     tasks: [...state.tasks],
          //   };
          // }

          // return {}; ///past this point
          const activeIndex = state.tasks.findIndex(
            (t) => t.id === activeTaskID
          );
          if (activeIndex === -1) return {};

          let updatedTasks = [...state.tasks];

          // Dropping task over another task
          if (isActiveTask && isOverTask) {
            const overIndex = state.tasks.findIndex((t) => t.id === overTaskID);
            if (overIndex === -1) return {};

            updatedTasks[activeIndex].columnID =
              updatedTasks[overIndex].columnID;
            updatedTasks = arrayMove(updatedTasks, activeIndex, overIndex).map(
              (task, index) => ({
                ...task,
                position: index, // Update position after moving
              })
            );
          }

          // Dropping task into a column
          if (isActiveTask && isOverColumn) {
            updatedTasks[activeIndex].columnID = overTaskID;
            updatedTasks = updatedTasks.map((task, index) => ({
              ...task,
              position: index, // Update position after moving
            }));
          }

          return { tasks: updatedTasks };
        }),
    }),
    {
      name: "task-store",
    }
  )
);
// const currentTheme = useThemeStore((state) => state.theme)
