import { useAuthStore } from "@/lib/store/auth.store";
import { Redirect } from "expo-router";

export default function Index() {
  const user = useAuthStore((state) => state.user);
  return user ? <Redirect href="/home" /> : <Redirect href="/(auth)/login" />;
}
