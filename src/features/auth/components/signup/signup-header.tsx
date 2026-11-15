import { Coffee } from "@/components/common/icons/svg";
import { AppText } from "@/components/common/text/app-text";
import { COLORS } from "@/lib/constants/color.constant";
import { FONT_SIZES, FONTS } from "@/lib/constants/font.constant";
import { StyleSheet, View } from "react-native";

export const SignupHeader = () => {
  return (
    <View style={styles.container}>
      <View style={styles.iconBar}>
        <Coffee color={COLORS.BRWON.DARK} />
        <AppText>Slow Brew Club</AppText>
      </View>
      <View>
        <AppText size={30} weight={FONTS.semibold} align="center">
          Create Account
        </AppText>
        <AppText
          size={FONT_SIZES.sm}
          color={COLORS.GREY.LIGHT_HOVER}
          align="center"
        >
          {"Enter your details to join our artisanal \n coffee circle"}
        </AppText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: 32,
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
