import { create } from "zustand";
import { persist } from "zustand/middleware";

const useCheckoutStore = create(
  persist(
    (set) => ({
      // Pooja details
      pooja: null,
      setPooja: (pooja) => set({ pooja }),

      // User details
      userDetails: {
        name: "",
        phone: "",
        email: "",
        houseNo: "",
        address: "",
        landmark: "",
        pinCode: "",
      },
      setUserDetails: (details) =>
        set((state) => ({
          userDetails: { ...state.userDetails, ...details },
        })),

      // Date and Time
      selectedDate: null,
      selectedTimeSlot: null,
      setSelectedDate: (date) => set({ selectedDate: date }),
      setSelectedTimeSlot: (slot) => set({ selectedTimeSlot: slot }),

      // Reset
      resetCheckout: () =>
        set({
          pooja: null,
          userDetails: {
            name: "",
            phone: "",
            email: "",
            houseNo: "",
            address: "",
            landmark: "",
            pinCode: "",
          },
          selectedDate: null,
          selectedTimeSlot: null,
        }),
    }),
    {
      name: "checkout-storage",
    }
  )
);

export default useCheckoutStore;