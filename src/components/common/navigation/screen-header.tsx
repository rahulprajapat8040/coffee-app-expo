import { COLORS } from "@/lib/constants/color.constant";
import { FONTS } from "@/lib/constants/font.constant";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import { ChevronLeft } from "../icons/svg";
import { AppText } from "../text/app-text";

interface Props {
  title?: string;
  rightIcon?: React.ReactNode;
  onIconPress?: () => void;
}
export const ScreenHeader = ({ title, rightIcon, onIconPress }: Props) => {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Pressable onPress={() => router.back()}>
        <AppText style={styles.title}>
          <ChevronLeft />
        </AppText>
      </Pressable>
      <AppText weight={FONTS.semibold}>{title}</AppText>
      {rightIcon ? (
        <Pressable
          accessibilityRole="button"
          disabled={!onIconPress}
          onPress={onIconPress}
          hitSlop={8}
        >
          {rightIcon}
        </Pressable>
      ) : (
        <View style={{ width: 20 }} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "static",
    top: 0,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 16,
    color: COLORS.GREY.NORMAL,
    fontWeight: "bold",
  },
});
