import { ArrowRight } from "@/components/common/icons/svg";
import { AppText } from "@/components/common/text/app-text";
import { COLORS } from "@/lib/constants/color.constant";
import { FONTS } from "@/lib/constants/font.constant";
import {
    BottomSheetBackdrop,
    BottomSheetModal,
    BottomSheetView,
} from "@gorhom/bottom-sheet";
import {
    forwardRef,
    useCallback,
    useImperativeHandle,
    useMemo,
    useRef,
    useState,
} from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { BlinkingCursor } from "./blink-cursor";

export interface OtpBottomSheetRef {
  open: () => void;
  close: () => void;
}

interface Props {
  email: string;
  onVerify: (otp: string) => void;
  onChangeEmail?: () => void;
}

const OTP_LENGTH = 6;

const KEYPAD = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
  ["fingerprint", "0", "backspace"],
];

export const OtpBottomSheet = forwardRef<OtpBottomSheetRef, Props>(
  ({ email, onVerify, onChangeEmail }, ref) => {
    const bottomSheetRef = useRef<BottomSheetModal>(null);

    const snapPoints = useMemo(() => ["85%"], []);

    const [otp, setOtp] = useState("");

    useImperativeHandle(ref, () => ({
      open: () => {
        setOtp("");
        bottomSheetRef.current?.present();
      },
      close: () => {
        bottomSheetRef.current?.dismiss();
      },
    }));

    const handleKeyPress = useCallback((key: string) => {
      if (key === "backspace") {
        setOtp((prev) => prev.slice(0, -1));
        return;
      }

      if (key === "fingerprint") {
        return;
      }

      setOtp((prev) => {
        if (prev.length >= OTP_LENGTH) return prev;
        return prev + key;
      });
    }, []);

    const handleVerify = () => {
      if (otp.length !== OTP_LENGTH) return;
      onVerify(otp);
    };

    const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          opacity={0.5}
          pressBehavior="close"
        />
      ),
      [],
    );

    return (
      <BottomSheetModal
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        backgroundStyle={styles.sheet}
        handleIndicatorStyle={styles.indicator}
        onDismiss={() => setOtp("")}
      >
        <BottomSheetView style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={{ flex: 1 }} />

            <Pressable
              onPress={() => bottomSheetRef.current?.dismiss()}
              style={styles.closeButton}
            >
              <AppText style={styles.closeText}>×</AppText>
            </Pressable>
          </View>

          {/* Title */}
          <AppText style={styles.title}>Verify code</AppText>

          {/* Email */}
          <View style={styles.emailRow}>
            <AppText style={styles.subtitle}>
              Sent to <AppText style={styles.email}>{email}</AppText>
            </AppText>

            {onChangeEmail && (
              <Pressable onPress={onChangeEmail}>
                <AppText style={styles.changeText}>Change</AppText>
              </Pressable>
            )}
          </View>

          {/* OTP Boxes */}
          <View style={styles.otpContainer}>
            {Array.from({ length: OTP_LENGTH }).map((_, index) => {
              const isActive = index === otp.length;
              const digit = otp[index];

              return (
                <Pressable
                  key={index}
                  onPress={() => {}}
                  style={[
                    styles.otpBox,
                    isActive && styles.activeOtpBox,
                    digit && styles.filledOtpBox,
                  ]}
                >
                  <AppText style={styles.otpDigit}>{digit || ""}</AppText>

                  {isActive && !digit && <BlinkingCursor />}
                </Pressable>
              );
            })}
          </View>

          {/* Verify Button */}
          <Pressable
            onPress={handleVerify}
            disabled={otp.length !== OTP_LENGTH}
            style={[
              styles.verifyButton,
              otp.length !== OTP_LENGTH && styles.disabledButton,
            ]}
          >
            <AppText style={styles.buttonText}>Verify</AppText>

            <ArrowRight color={COLORS.SURFACE.WHITE} size={18} />
          </Pressable>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Custom Numeric Keypad */}
          <View style={styles.keypad}>
            {KEYPAD.map((row, rowIndex) => (
              <View style={styles.keypadRow} key={rowIndex}>
                {row.map((key) => (
                  <Pressable
                    key={key}
                    onPress={() => handleKeyPress(key)}
                    style={styles.key}
                  >
                    {key === "backspace" ? (
                      <AppText style={styles.specialKey}>⌫</AppText>
                    ) : key === "fingerprint" ? (
                      <AppText style={styles.fingerprint}>◉</AppText>
                    ) : (
                      <AppText style={styles.keyText}>{key}</AppText>
                    )}
                  </Pressable>
                ))}
              </View>
            ))}
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    );
  },
);

const styles = StyleSheet.create({
  sheet: {
    backgroundColor: COLORS.SURFACE.WHITE,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },

  indicator: {
    backgroundColor: COLORS.BRWON.NORMAL,
    width: 50,
    height: 6,
  },

  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 16,
  },

  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 8,
  },

  closeButton: {
    width: 38,
    height: 38,
    borderRadius: 20,
    backgroundColor: "#F5F3F2",
    alignItems: "center",
    justifyContent: "center",
  },

  closeText: {
    fontSize: 25,
    color: "#555555",
    lineHeight: 29,
  },

  title: {
    fontSize: 25,
    fontFamily: FONTS.bold,
    color: "#202020",
  },

  emailRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginTop: 5,
    gap: 5,
  },

  subtitle: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: "#77716D",
  },

  email: {
    color: "#292929",
    fontFamily: FONTS.medium,
  },

  changeText: {
    fontSize: 14,
    color: "#914C24",
    fontFamily: FONTS.semibold,
  },

  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
    marginTop: 22,
    marginBottom: 22,
  },

  otpBox: {
    flex: 1,
    height: 60,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: "#E9E3DF",
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },

  activeOtpBox: {
    borderColor: "#914C24",
    borderWidth: 2,
    shadowColor: "#914C24",
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },

  filledOtpBox: {
    backgroundColor: "#F5F3F2",
  },

  otpDigit: {
    fontSize: 23,
    fontFamily: FONTS.semibold,
    color: "#222222",
  },

  cursor: {
    width: 2,
    height: 25,
    backgroundColor: "#914C24",
    position: "absolute",
  },

  verifyButton: {
    height: 52,
    borderRadius: 30,
    backgroundColor: "#914C24",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },

  disabledButton: {
    opacity: 0.55,
  },

  buttonText: {
    fontSize: 16,
    fontFamily: FONTS.semibold,
    color: "#FFFFFF",
  },

  divider: {
    height: 1,
    backgroundColor: "#EEEEEE",
    marginTop: 20,
    marginBottom: 4,
  },

  keypad: {
    flex: 1,
    justifyContent: "space-evenly",
    gap: 12,
  },

  keypadRow: {
    flexDirection: "row",
    gap: 18,
    height: 52,
  },

  key: {
    flex: 1,
    borderRadius: 15,
    backgroundColor: "#F8F8F8",
    justifyContent: "center",
    alignItems: "center",
  },

  keyText: {
    fontSize: 18,
    fontFamily: FONTS.semibold,
    color: "#222222",
  },

  specialKey: {
    fontSize: 23,
    color: "#333333",
  },

  fingerprint: {
    fontSize: 22,
    color: "#A68D7D",
  },
});
