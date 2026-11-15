import { AppText } from "@/components/common/text/app-text";
import { COLORS } from "@/lib/constants/color.constant";
import { FONTS } from "@/lib/constants/font.constant";
import { Image, StyleSheet, View } from "react-native";

export const SocialLogin = () => {
  return (
    <View>
      <View style={[styles.socialContainer, { backgroundColor: "white" }]}>
        <Image
          source={require("@/assets/images/icons/google-icon.png")}
          style={{ width: 18, height: 18 }}
        />
        <AppText weight={FONTS.medium}>Continue with Google</AppText>
      </View>
      <View
        style={[styles.socialContainer, { backgroundColor: COLORS.GREY.DARK }]}
      >
        <Image
          source={require("@/assets/images/icons/apple-icon.png")}
          style={{ width: 18, height: 18 }}
        />
        <AppText color={COLORS.SURFACE.WHITE} weight={FONTS.medium}>
          Continue with Apple
        </AppText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  socialContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 52,
    borderRadius: 50,
    gap: 12,
    marginBottom: 12,
  },
});
