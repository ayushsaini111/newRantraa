import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const initialUserDetails = {
  name: "",
  phone: "",
  email: "",
  houseNo: "",
  address: "",
  landmark: "",
  pinCode: "",
};

const useCheckoutStore = create(
  persist(
    (set, get) => ({
      // Hydration flag — prevents SSR mismatch
      hasHydrated: false,
      setHasHydrated: (value) => set({ hasHydrated: value }),

      // Pooja details
      pooja: null,
      poojaId: null,

      setPooja: (pooja) =>
        set({
          pooja,
          poojaId: pooja?.id ?? null,
        }),

      clearPooja: () => set({ pooja: null, poojaId: null }),

      // User details
      userDetails: initialUserDetails,

      setUserDetails: (details) =>
        set((state) => ({
          userDetails: { ...state.userDetails, ...details },
        })),

      // Pre-fill from session (only fills empty fields)
      prefillFromSession: (session) => {
        if (!session?.user) return;

        set((state) => ({
          userDetails: {
            ...state.userDetails,
            name: state.userDetails.name || session.user.name || "",
            email: state.userDetails.email || session.user.email || "",
            phone: state.userDetails.phone || session.user.phone || "",
          },
        }));
      },

      // Date and Time
      selectedDate: null,
      selectedTimeSlot: null,

      setSelectedDate: (date) => set({ selectedDate: date }),
      setSelectedTimeSlot: (slot) => set({ selectedTimeSlot: slot }),

      // Validation helper
      isCheckoutReady: () => {
        const { pooja, userDetails, selectedDate, selectedTimeSlot } = get();

        return Boolean(
          pooja &&
            userDetails.name.trim() &&
            userDetails.phone.trim() &&
            selectedDate &&
            selectedTimeSlot
        );
      },

      // Reset everything
      resetCheckout: () =>
        set({
          pooja: null,
          poojaId: null,
          userDetails: initialUserDetails,
          selectedDate: null,
          selectedTimeSlot: null,
        }),
    }),
    {
      name: "checkout-storage",
      storage: createJSONStorage(() => localStorage),

      // Don't persist the hydration flag
      partialize: (state) => ({
        pooja: state.pooja,
        poojaId: state.poojaId,
        userDetails: state.userDetails,
        selectedDate: state.selectedDate,
        selectedTimeSlot: state.selectedTimeSlot,
      }),

      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

export default useCheckoutStore;