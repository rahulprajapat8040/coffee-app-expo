import { AppText } from "@/components/common/text/app-text";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { COLORS } from "@/lib/constants/color.constant";
import { FONTS } from "@/lib/constants/font.constant";
import { useAuthStore } from "@/lib/store/auth.store";
import { tokenStorage } from "@/lib/storage/token-storage";
import { queryClient } from "@/api/query-client";
import { userApi } from "@/services/user.service";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Profile = () => {
  const router = useRouter();
  const currentUser = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const clearUser = useAuthStore((state) => state.clearUser);
  const [name, setName] = useState(currentUser?.name ?? "");
  const { data, isLoading, isError } = useQuery({
    queryKey: ["profile"],
    queryFn: userApi.getMyProfile,
  });
  const profile = data?.data ?? currentUser;

  useEffect(() => {
    if (profile?.name) setName(profile.name);
  }, [profile?.name]);

  const { mutate: saveProfile, isPending } = useApiMutation(
    userApi.updateMyProfile,
    {
      onSuccess: (response) => setUser(response.data),
      onError: (error) => Alert.alert("Couldn't save profile", error.message),
    },
  );

  const logout = async () => {
    try {
      await tokenStorage.clearTokens();
      queryClient.clear();
      clearUser();
      router.replace("/(auth)/login");
    } catch (error) {
      Alert.alert(
        "Couldn't log out",
        error instanceof Error ? error.message : "Please try again.",
      );
    }
  };

  const openOrders = () => router.push("/(app)/(tabs)/orders");

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <AppText size={22} weight={FONTS.semibold}>
          Your profile
        </AppText>
        <AppText color={COLORS.GREY.LIGHT_HOVER} style={{ marginTop: 4 }}>
          Your details and preferences
        </AppText>

        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <AppText
              size={25}
              weight={FONTS.semibold}
              color={COLORS.BRWON.DARK}
            >
              {(profile?.name || "C").trim().charAt(0).toUpperCase()}
            </AppText>
          </View>
          <View style={{ flex: 1 }}>
            <AppText size={17} weight={FONTS.semibold}>
              {isLoading
                ? "Loading profile..."
                : profile?.name || "Coffee lover"}
            </AppText>
            <AppText
              size={12}
              color={COLORS.GREY.LIGHT_HOVER}
              style={{ marginTop: 4 }}
            >
              {profile?.email || ""}
            </AppText>
          </View>
          <Ionicons name="leaf-outline" size={20} color={COLORS.BRWON.NORMAL} />
        </View>

        <View style={styles.section}>
          <AppText weight={FONTS.semibold} style={styles.sectionTitle}>
            Personal details
          </AppText>
          <AppText
            size={12}
            color={COLORS.GREY.LIGHT_HOVER}
            style={{ marginBottom: 8 }}
          >
            Name
          </AppText>
          <View style={styles.nameInputRow}>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Your name"
              placeholderTextColor="#A39A92"
              maxLength={80}
              autoCapitalize="words"
              style={styles.nameInput}
            />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Save profile name"
              disabled={
                isPending || !name.trim() || name.trim() === profile?.name
              }
              onPress={() => saveProfile({ name: name.trim() })}
              style={[
                styles.saveButton,
                (isPending || !name.trim() || name.trim() === profile?.name) &&
                  styles.disabledButton,
              ]}
            >
              <AppText size={12} weight={FONTS.semibold} color="#fff">
                {isPending ? "Saving" : "Save"}
              </AppText>
            </Pressable>
          </View>
          {isError && (
            <AppText size={12} color="#A44D2A" style={{ marginTop: 8 }}>
              Profile details couldn't be refreshed. Your saved details are
              still shown.
            </AppText>
          )}
        </View>

        <View style={styles.menuCard}>
          <MenuRow
            icon="receipt-outline"
            label="My orders"
            detail="Track your brews and view past orders"
            onPress={openOrders}
          />
          <MenuRow
            icon="location-outline"
            label="Saved addresses"
            detail="Manage where we deliver"
            onPress={() => router.push("/address")}
          />
          <MenuRow
            icon="heart-outline"
            label="Wishlist"
            detail="Your saved coffee"
            onPress={() => router.push("/(app)/(tabs)/wishlist")}
            last
          />
        </View>

        <Pressable style={styles.logoutButton} onPress={logout}>
          <Ionicons name="log-out-outline" size={19} color="#9B4F35" />
          <AppText weight={FONTS.semibold} color="#9B4F35">
            Log out
          </AppText>
        </Pressable>
        <AppText
          size={11}
          color={COLORS.GREY.LIGHT_HOVER}
          align="center"
          style={{ marginTop: 16 }}
        >
          Crafted fresh, one cup at a time.
        </AppText>
      </ScrollView>
    </SafeAreaView>
  );
};

const MenuRow = ({
  icon,
  label,
  detail,
  onPress,
  last,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  detail: string;
  onPress: () => void;
  last?: boolean;
}) => (
  <Pressable
    onPress={onPress}
    style={[styles.menuRow, !last && styles.menuDivider]}
  >
    <View style={styles.menuIcon}>
      <Ionicons name={icon} size={19} color={COLORS.BRWON.DARK} />
    </View>
    <View style={{ flex: 1 }}>
      <AppText weight={FONTS.semibold}>{label}</AppText>
      <AppText
        size={11}
        color={COLORS.GREY.LIGHT_HOVER}
        style={{ marginTop: 3 }}
      >
        {detail}
      </AppText>
    </View>
    <Ionicons name="chevron-forward" size={17} color="#AFA79F" />
  </Pressable>
);

export default Profile;

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F8F6F3" },
  content: { padding: 20, paddingBottom: 30 },
  profileCard: {
    marginTop: 22,
    marginBottom: 18,
    padding: 16,
    borderRadius: 18,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.BRWON.LIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: { marginBottom: 14 },
  nameInputRow: { flexDirection: "row", alignItems: "center", gap: 9 },
  nameInput: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: "#F8F6F3",
    color: COLORS.GREY.DARK,
    fontFamily: FONTS.regular,
    fontSize: 14,
  },
  saveButton: {
    height: 40,
    minWidth: 62,
    borderRadius: 20,
    backgroundColor: COLORS.BRWON.DARK,
    alignItems: "center",
    justifyContent: "center",
  },
  disabledButton: { opacity: 0.45 },
  menuCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    paddingHorizontal: 15,
  },
  menuRow: {
    minHeight: 76,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  menuDivider: { borderBottomWidth: 1, borderBottomColor: "#F1ECE7" },
  menuIcon: {
    width: 38,
    height: 38,
    borderRadius: 13,
    backgroundColor: COLORS.BRWON.LIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  logoutButton: {
    minHeight: 50,
    marginTop: 19,
    borderWidth: 1,
    borderColor: "#F0D8D1",
    borderRadius: 14,
    backgroundColor: "#FFF9F7",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
});
