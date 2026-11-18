import { queryClient } from "@/api/query-client";
import { BookMark, CricleX, MapPin } from "@/components/common/icons/svg";
import { AppText } from "@/components/common/text/app-text";
import Button from "@/components/ui/button";
import { FormError } from "@/components/ui/form-error";
import { AppTextInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { COLORS } from "@/lib/constants/color.constant";
import { FONT_SIZES, FONTS } from "@/lib/constants/font.constant";
import { logger } from "@/lib/helper/logger.helper";
import { IAddressForm } from "@/lib/interfaces/address/address-form.interface";
import { homeApi } from "@/services/home.service";
import {
    BottomSheetBackdrop,
    BottomSheetModal,
    BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import {
    forwardRef,
    useCallback,
    useImperativeHandle,
    useMemo,
    useRef,
} from "react";
import { Controller, useForm } from "react-hook-form";
import { Pressable, StyleSheet, View } from "react-native";

export interface AddressBottomSheetRef {
  open: () => void;
  close: () => void;
}

interface Props {
  id?: string;
  defaultValues: IAddressForm;
}

export const AddressForm = forwardRef<AddressBottomSheetRef, Props>(
  ({ id, defaultValues }, ref) => {
    const isEdit = Boolean(id);

    const {
      control,
      watch,
      reset,
      setValue,
      handleSubmit,
      formState: { errors },
    } = useForm<IAddressForm>({
      defaultValues,
      mode: "onBlur",
    });

    const [nickName, address] = watch(["nickName", "address"]);

    const bottomSheetRef = useRef<BottomSheetModal>(null);

    const snapPoints = useMemo(() => ["85%"], []);

    useImperativeHandle(
      ref,
      () => ({
        open: () => {
          reset(defaultValues);
          bottomSheetRef.current?.present();
        },
        close: () => bottomSheetRef.current?.dismiss(),
      }),
      [defaultValues, reset],
    );

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

    const onSuccess = () => {
      logger.log(isEdit ? "Address updated" : "Address added");
      reset(defaultValues);
      bottomSheetRef.current?.dismiss();
      queryClient.invalidateQueries({ queryKey: ["address", "list"] });
    };

    const { mutate: mutateAdd, isPending: addPending } = useApiMutation(
      homeApi.addAddress,
      { onSuccess },
    );

    const { mutate: mutateEdit, isPending: editPending } = useApiMutation(
      homeApi.updateAddress,
      { onSuccess },
    );

    const onSubmit = (values: IAddressForm) => {
      if (isEdit && id) {
        mutateEdit({
          id,
          ...values,
        });
      } else {
        mutateAdd(values);
      }
    };

    const isPending = addPending || editPending;

    return (
      <BottomSheetModal
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        backgroundStyle={styles.sheet}
        handleIndicatorStyle={styles.indicator}
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
        android_keyboardInputMode="adjustResize"
      >
        <BottomSheetScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={{ flex: 1 }}>
              <AppText size={FONT_SIZES.lg} weight={FONTS.medium}>
                {isEdit ? "Edit Address" : "Add New Address"}
              </AppText>

              <AppText size={FONT_SIZES.sm}>
                {isEdit
                  ? "Update your delivery address details."
                  : "Where should we deliver your freshly brewed roast?"}
              </AppText>
            </View>

            <Pressable
              onPress={() => bottomSheetRef.current?.dismiss()}
              style={styles.closeButton}
            >
              <AppText style={styles.closeText}>×</AppText>
            </Pressable>
          </View>

          {/* Form */}
          <View style={{ gap: 16 }}>
            {/* Nickname */}
            <View>
              <Label label="Nick Name" />

              <View>
                <View style={styles.leftIcon}>
                  <BookMark size={20} color={COLORS.BRWON.NORMAL} />
                </View>

                <Controller
                  control={control}
                  name="nickName"
                  rules={{
                    required: "Please enter a nickname",
                    minLength: {
                      value: 2,
                      message: "Nickname must be at least 2 characters",
                    },
                    maxLength: {
                      value: 30,
                      message: "Nickname cannot exceed 30 characters",
                    },
                  }}
                  render={({ field }) => (
                    <AppTextInput
                      value={field.value}
                      placeholder="e.g. Dad's house"
                      onChangeText={field.onChange}
                      onBlur={field.onBlur}
                      style={styles.input}
                    />
                  )}
                />

                {nickName?.length > 0 && (
                  <Pressable
                    onPress={() =>
                      setValue("nickName", "", {
                        shouldValidate: true,
                        shouldDirty: true,
                      })
                    }
                    style={styles.rightIcon}
                  >
                    <CricleX size={20} />
                  </Pressable>
                )}
              </View>

              <FormError message={errors.nickName?.message} />
            </View>

            {/* Address */}
            <View>
              <Label label="Address" />

              <View>
                <View style={styles.leftIcon}>
                  <MapPin size={20} color={COLORS.BRWON.NORMAL} />
                </View>

                <Controller
                  control={control}
                  name="address"
                  rules={{
                    required: "Please enter your address",
                    minLength: {
                      value: 5,
                      message: "Address must be at least 5 characters",
                    },
                    maxLength: {
                      value: 200,
                      message: "Address cannot exceed 200 characters",
                    },
                  }}
                  render={({ field }) => (
                    <AppTextInput
                      value={field.value}
                      placeholder="e.g. Kali ghati, Jaipur"
                      onChangeText={field.onChange}
                      onBlur={field.onBlur}
                      style={styles.input}
                      multiline
                    />
                  )}
                />

                {address?.length > 0 && (
                  <Pressable
                    onPress={() => {
                      setValue("address", "", {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                      setValue("latitude", null);
                      setValue("longitude", null);
                    }}
                    style={styles.rightIcon}
                  >
                    <CricleX size={20} />
                  </Pressable>
                )}
              </View>

              <FormError message={errors.address?.message} />
            </View>

            {/* Submit */}
            <Button
              style={{ marginTop: 12 }}
              onPress={handleSubmit(onSubmit)}
              disabled={isPending}
              loading={isPending}
            >
              <AppText color={COLORS.SURFACE.WHITE} weight={FONTS.medium}>
                {isPending
                  ? "Please wait..."
                  : isEdit
                    ? "Update Address"
                    : "Save Address"}
              </AppText>
            </Button>
          </View>
        </BottomSheetScrollView>
      </BottomSheetModal>
    );
  },
);

AddressForm.displayName = "AddressForm";

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
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 30,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 16,
    gap: 12,
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
  leftIcon: {
    position: "absolute",
    left: 8,
    top: "50%",
    zIndex: 1,
    transform: [{ translateY: -10 }],
  },
  rightIcon: {
    position: "absolute",
    right: 8,
    top: "50%",
    zIndex: 1,
    transform: [{ translateY: -10 }],
  },
  input: {
    paddingHorizontal: 32,
  },
});
