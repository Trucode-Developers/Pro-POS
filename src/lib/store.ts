import { create } from "zustand";
import { v4 as uuid } from "uuid";
import { persist } from "zustand/middleware";



export type ThemeState = {
  activeDb: string;
  fontSize: number;
  tabsBgColor: string;
  tabsColor: string;
  salesBgColor: string;
  salesColor: string;

};

export type ThemeActions = {
  darkMode: () => void;
  lightMode: () => void;
};



export const useThemeStore = create<ThemeState & ThemeActions>()(
  persist(
    (set) => ({
      activeDb: "sqlite",
      fontSize: 12,
      tabsBgColor: "#1c1c1c",
      tabsColor: "#ffffff",
      salesBgColor: "#1c1c1c",
      salesColor: "#ffffff",

      darkMode: () =>
        set((state) => ({
          tabsBgColor: "#1c1c1c",
          tabsColor: "#ffffff",
          salesBgColor: "#1c1c1c",
          salesColor: "#ffffff",
        })),
      lightMode: () =>
        set((state) => ({
          tabsBgColor: "#ffffff",
          tabsColor: "#000000",
          salesBgColor: "#ffffff",
          salesColor: "#000000",
        })),
    }),
    { name: "theme-store", skipHydration: true }
    
    // then  useThemeStore.persist.rehydrate(); in the app/initiator.tsx
  )
);

export const getTabStyle = () => ({
  backgroundColor: useThemeStore((state) => state.tabsBgColor),
  color: useThemeStore((state) => state.tabsColor),
  fontSize: `${useThemeStore((state) => state.fontSize)}px`,
});

export const getSalesStyle = () => ({
  backgroundColor: useThemeStore((state) => state.salesBgColor),
  color: useThemeStore((state) => state.salesColor),
  fontSize: `${useThemeStore((state) => state.fontSize)}px`,
});





















export type Status = "TODO" | "IN_PROGRESS" | "DONE";

export type FontSize = {
  id: string;
  title: string;
  description?: string;
  fontSize: number;
};
export type Tasks = {
  id: string;
  title: string;
  description?: string;
  status: Status;
};

export type State = {
  tasks: Tasks[];
  draggedTask: string | null;
};

export type Actions = {
  addTask: (title: string, description?: string) => void;
  dragTask: (id: string | null) => void;
  removeTask: (title: string) => void;
  updateTask: (title: string, status: Status) => void;
};


export const useOtherStore = create<State & Actions>()(
  persist(
    (set) => ({

      tasks: [],
      draggedTask: null,
      addTask: (title: string, description?: string) =>
        set((state) => ({
          tasks: [
            ...state.tasks,
            { id: uuid(), title, description, status: "TODO" },
          ],
        })),
      dragTask: (id: string | null) => set({ draggedTask: id }),
      removeTask: (id: string) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        })),
      updateTask: (id: string, status: Status) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, status } : task
          ),
        })),
    }),
    { name: "other-store", skipHydration: true }
    // then  useThemeStore.persist.rehydrate(); in the app/page.tsx 
  )
);
