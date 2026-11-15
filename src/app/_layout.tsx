import "@/api/axios/interceptors";

import { FONTS } from "@/lib/constants/font.constant";
import { useAuthStore } from "@/lib/store/auth.store";

import { AuthProvider } from "@/providers/auth-provider";
import { QueryProvider } from "@/providers/query-provider";

import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { StatusBar } from "expo-status-bar";

function RootNavigator() {
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);

  if (isLoading) return null;

  const isAuthenticated = !!user;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />

      <Stack.Protected guard={!isAuthenticated}>
        <Stack.Screen name="(auth)/login" />
        <Stack.Screen name="(auth)/signup" />
      </Stack.Protected>

      <Stack.Protected guard={isAuthenticated}>
        <Stack.Screen name="(app)/home" />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({
    [FONTS.regular]: require("@/assets/fonts/Sora-Regular.ttf"),
    [FONTS.medium]: require("@/assets/fonts/Sora-Medium.ttf"),
    [FONTS.semibold]: require("@/assets/fonts/Sora-SemiBold.ttf"),
    [FONTS.bold]: require("@/assets/fonts/Sora-Bold.ttf"),
    [FONTS.light]: require("@/assets/fonts/Sora-Light.ttf"),
  });

  if (!loaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="inverted" />

      <QueryProvider>
        <AuthProvider>
          <BottomSheetModalProvider>
            <SafeAreaProvider>
              <RootNavigator />
            </SafeAreaProvider>
          </BottomSheetModalProvider>
        </AuthProvider>
      </QueryProvider>
    </GestureHandlerRootView>
  );
}
