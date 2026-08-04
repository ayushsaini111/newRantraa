import { create } from "zustand";

const useAuthStore = create((set) => ({
  user: null,
  status: "loading",

  hydrate(user) {
    set({
      user,
      status: user ? "authenticated" : "unauthenticated",
    });
  },

  login(user) {
    set({
      user,
      status: "authenticated",
    });
  },

  updateOnboarding(value) {
    set((state) => ({
      user: state.user
        ? {
            ...state.user,
            hasCompletedOnboarding: value,
          }
        : null,
    }));
  },

  logout() {
    set({
      user: null,
      status: "unauthenticated",
    });
  },
}));

export default useAuthStore;