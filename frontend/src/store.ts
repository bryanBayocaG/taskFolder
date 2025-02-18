import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Column, ID } from "./type";
import { arrayMove } from "@dnd-kit/sortable";

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

      moveColumn: (activeColumnID, overColumnID) =>
        set((state) => {
          const activeIndex = state.columns.findIndex(
            (col) => col.id === activeColumnID
          );
          const overIndex = state.columns.findIndex(
            (col) => col.id === overColumnID
          );

          if (activeIndex === -1 || overIndex === -1) return state; // Prevent errors

          return {
            columns: arrayMove(state.columns, activeIndex, overIndex),
          };
        }),
      clearColumns: () => set({ columns: [] }),
    }),
    {
      name: "column-store",
    }
  )
);
// const currentTheme = useThemeStore((state) => state.theme)
