// 초기 예시
import { create } from "zustand";

interface AppState {
  count: number;
  increase: () => void;
  decrease: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  count: 0,
  increase: () => set((state) => ({ count: state.count + 1 })),
  decrease: () => set((state) => ({ count: state.count - 1 })),
}));
