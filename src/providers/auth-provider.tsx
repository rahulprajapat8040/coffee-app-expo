import { useEffect } from "react";

import { AppText } from "@/components/common/text/app-text";
import { useAuthStore } from "@/lib/store/auth.store";
import { authApi } from "@/services/auth.service";
import { useQuery } from "@tanstack/react-query";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setUser = useAuthStore((state) => state.setUser);

  const clearUser = useAuthStore((state) => state.clearUser);
  const setLoading = useAuthStore((state) => state.setLoading);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["me"],

    queryFn: authApi.me,

    retry: false,
  });

  useEffect(() => {
    if (isLoading) {
      setLoading(true);
      return;
    }

    if (data) {
      setUser(data.data);
    } else {
      clearUser();
    }
  }, [data, isError, setUser, clearUser, isLoading]);

  if (isLoading) {
    return (
      <>
        <AppText>Loading...</AppText>
      </>
    );
  }

  return children;
}
