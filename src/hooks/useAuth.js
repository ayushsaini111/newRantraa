import useAuthStore from "@/store/authStore";

export default function useAuth() {
  const user = useAuthStore((state) => state.user);

  const status = useAuthStore((state) => state.status);

  return {
    user,
    status,
    isLoggedIn: status === "authenticated",
  };
}