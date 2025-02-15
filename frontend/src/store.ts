import { create } from "zustand";
import { persist } from "zustand/middleware";

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
// const currentTheme = useThemeStore((state) => state.theme)
