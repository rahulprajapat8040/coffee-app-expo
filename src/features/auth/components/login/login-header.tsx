import { Coffee } from "@/components/common/icons/svg";
import { AppText } from "@/components/common/text/app-text";
import { COLORS } from "@/lib/constants/color.constant";
import { FONT_SIZES, FONTS } from "@/lib/constants/font.constant";
import { StyleSheet, View } from "react-native";

export const LoginHeader = () => {
  return (
    <View style={styles.container}>
      <View style={styles.iconBar}>
        <Coffee color={COLORS.BRWON.DARK} />
        <AppText>Slow Brew Club</AppText>
      </View>
      <View>
        <AppText size={30} weight={FONTS.semibold}>
          Welcome back
        </AppText>
        <AppText size={FONT_SIZES.sm} align="center">
          Enter your email to continue
        </AppText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: 50,
    marginBottom: 30,
  },
  iconBar: {
    width: "60%",
    backgroundColor: COLORS.BRWON.LIGHT,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 50,
    marginBottom: 4,
  },
});
