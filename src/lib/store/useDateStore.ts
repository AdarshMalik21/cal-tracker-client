import { create } from "zustand";
import { formatDate, getTodayString } from "@/lib/utils";

interface DateStore {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  goToPrevDay: () => void;
  goToNextDay: () => void;
  isToday: () => boolean;
}

export const useDateStore = create<DateStore>((set, get) => ({
  selectedDate: getTodayString(),

  setSelectedDate: (date) => set({ selectedDate: date }),

  goToPrevDay: () => {
    const current = new Date(get().selectedDate + "T00:00:00");
    current.setDate(current.getDate() - 1);
    set({ selectedDate: formatDate(current) });
  },

  goToNextDay: () => {
    const current = new Date(get().selectedDate + "T00:00:00");
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (current < today) {
      current.setDate(current.getDate() + 1);
      set({ selectedDate: formatDate(current) });
    }
  },

  isToday: () => get().selectedDate === getTodayString(),
}));
