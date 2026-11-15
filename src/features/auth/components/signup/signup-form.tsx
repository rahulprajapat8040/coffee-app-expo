import { MailIcon, UserIcon } from "@/components/common/icons/svg";
import { AppText } from "@/components/common/text/app-text";
import Button from "@/components/ui/button";
import { AppTextInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { COLORS } from "@/lib/constants/color.constant";
import { FONT_SIZES, FONTS } from "@/lib/constants/font.constant";
import { DeviceType } from "@/lib/enum";
import { ISignupForm } from "@/lib/interfaces/auth/auth-form.interface";
import { tokenStorage } from "@/lib/storage/token-storage";
import { authApi } from "@/services/auth.service";
import { useRouter } from "expo-router";
import { useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { Pressable, StyleSheet, View } from "react-native";
import { OtpBottomSheet, OtpBottomSheetRef } from "../common/otp-sheet";
import { SocialLogin } from "../common/social-login";

export const SignupForm = () => {
  const router = useRouter();
  const otpSheetRef = useRef<OtpBottomSheetRef>(null);
  const { control, handleSubmit, watch } = useForm<ISignupForm>({
    defaultValues: {
      deviceId: "343433",
      deviceToken: "34343",
      deviceType: DeviceType.ANDORID,
      email: "",
      name: "",
      otp: "",
    },
  });

  const email = watch("email");

  const { mutateAsync: mutateOTPSend, isPending: isOTPPending } =
    useApiMutation(authApi.sendOTP, {
      onSuccess(data) {
        console.log("OTP sent successfully", data);
      },
      onError(err) {
        console.log(err.message || "Error in OTP send");
      },
    });

  const { mutateAsync: signupMutate, isPending: isLoginPending } =
    useApiMutation(authApi.signup, {
      async onSuccess(data) {
        await tokenStorage.setTokens(
          data.data.accessToken,
          data.data.refreshToken,
        );
        router.push("/");
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

  const handleVerify = async (data: ISignupForm) => {
    await signupMutate(data);
    otpSheetRef.current?.close();
  };

  return (
    <View style={{ rowGap: 12 }}>
      <View>
        <Label label="Full Name" />
        <View style={{ position: "relative" }}>
          <View style={styles.icon}>
            <UserIcon size={20} color={COLORS.BRWON.NORMAL} />
          </View>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => {
              return (
                <AppTextInput
                  style={[styles.input]}
                  placeholder="Maya Lin"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  autoCapitalize="words"
                  autoCorrect={true}
                />
              );
            }}
          />
        </View>
      </View>
      <View>
        <Label label="Email" />
        <View style={{ position: "relative" }}>
          <View style={styles.icon}>
            <MailIcon size={20} color={COLORS.BRWON.NORMAL} />
          </View>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => {
              return (
                <AppTextInput
                  style={[styles.input]}
                  placeholder="maya@roastery.com"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  autoCapitalize="words"
                  autoCorrect={false}
                />
              );
            }}
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
          Create Account
        </AppText>
      </Button>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
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
      <View style={styles.loginText}>
        <AppText>Already have an account? </AppText>
        <Pressable onPress={() => router.push("/login")}>
          <AppText color={COLORS.BRWON.DARK} weight={FONTS.semibold}>
            Log in
          </AppText>
        </Pressable>
      </View>
      <OtpBottomSheet
        ref={otpSheetRef}
        email={email}
        onVerify={(otp) =>
          handleSubmit((data) => handleVerify({ ...data, otp }))()
        }
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
  loginText: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
