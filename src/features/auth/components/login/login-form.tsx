import { MailIcon } from "@/components/common/icons/svg";
import { AppText } from "@/components/common/text/app-text";
import Button from "@/components/ui/button";
import { AppTextInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { COLORS } from "@/lib/constants/color.constant";
import { FONT_SIZES, FONTS } from "@/lib/constants/font.constant";
import { DeviceType } from "@/lib/enum";
import { tokenStorage } from "@/lib/storage/token-storage";
import { authApi } from "@/services/auth.service";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { OtpBottomSheet, OtpBottomSheetRef } from "../common/otp-sheet";
import { SocialLogin } from "../common/social-login";

export const LoginForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const otpSheetRef = useRef<OtpBottomSheetRef>(null);

  const { mutateAsync: mutateOTPSend, isPending: isOTPPending } =
    useApiMutation(authApi.sendOTP, {
      onSuccess(data) {
        console.log("OTP sent successfully", data);
      },
      onError(err) {
        console.log(err.message || "Error in OTP send");
      },
    });

  const { mutateAsync: loginMutate, isPending: isLoginPending } =
    useApiMutation(authApi.login, {
      async onSuccess(data) {
        await tokenStorage.setTokens(
          data.data.accessToken,
          data.data.refreshToken,
        );
        router.push("/home");
      },
      onError(err) {
        console.log(err.message || "Error in login");
      },
    });

  const handleContinue = async () => {
    if (!email.trim()) return;
    await mutateOTPSend({ email });

    otpSheetRef.current?.open();
  };

  const handleVerify = async (otp: string) => {
    await loginMutate({
      email,
      otp,
      deviceType: DeviceType.ANDORID,
      deviceId: "2322",
      deviceToken: "34335",
    });
    otpSheetRef.current?.close();
  };

  return (
    <View style={{ rowGap: 12 }}>
      <View>
        <Label label="Email" />
        <View style={{ position: "relative" }}>
          <View style={styles.icon}>
            <MailIcon size={20} color={COLORS.BRWON.NORMAL} />
          </View>
          <AppTextInput
            style={[styles.input]}
            placeholder="maya@roastery.com"
            value={email}
            onChangeText={(text) => setEmail(text)}
            autoCorrect={false}
            keyboardType="email-address"
          />
        </View>
      </View>
      <Button
        style={{ marginTop: 18, paddingVertical: 15 }}
        onPress={() => handleContinue()}
      >
        <AppText
          size={FONT_SIZES.md}
          color={COLORS.SURFACE.WHITE}
          weight={FONTS.semibold}
        >
          Continue
        </AppText>
      </Button>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
          marginTop: 18,
        }}
      >
        <Separator
          color={COLORS.SURFACE.LIGHT_ACTIVE}
          width={"40%"}
          height={1}
        />
        <AppText>or</AppText>
        <Separator
          color={COLORS.SURFACE.LIGHT_ACTIVE}
          width={"40%"}
          height={1}
        />
      </View>
      <SocialLogin />
      <View style={styles.signupText}>
        <AppText>Don't have an account ?</AppText>
        <Pressable onPress={() => router.push("/signup")}>
          <AppText color={COLORS.BRWON.DARK} weight={FONTS.medium}>
            Sign up
          </AppText>
        </Pressable>
      </View>
      <OtpBottomSheet
        ref={otpSheetRef}
        email={email}
        onVerify={(otp) => handleVerify(otp)}
        onChangeEmail={() => otpSheetRef.current?.close()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  icon: {
    position: "absolute",
    left: 8,
    top: "50%",
    zIndex: 1,
    transform: [{ translateY: "-50%" }],
  },
  input: {
    paddingLeft: 32,
  },
  signupText: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
});
