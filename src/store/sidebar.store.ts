// store/sidebar.store.ts
import { create } from 'zustand';

interface SidebarStore {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
}

export const useSidebarStore = create<SidebarStore>((set) => ({
  collapsed: false,
  setCollapsed: (collapsed) => set({ collapsed }),
}));