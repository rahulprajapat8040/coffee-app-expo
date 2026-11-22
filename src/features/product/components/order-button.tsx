import { AppText } from "@/components/common/text/app-text";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { COLORS } from "@/lib/constants/color.constant";
import { FONTS } from "@/lib/constants/font.constant";
import { IAddToCart } from "@/lib/interfaces/order/order-form.interface";
import { orderApi } from "@/services/order.service";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet } from "react-native";
import { useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";

interface Props {
  coffeeId: string;
  variantId: string;
  quantity?: number;
  disabled?: boolean;
}

export const OrderButton = ({
  coffeeId,
  variantId,
  quantity = 1,
  disabled = false,
}: Props) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutate, isPending } = useApiMutation(orderApi.addToCart, {
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      router.push("/cart");
    },
    onError: (error) =>
      Alert.alert("Couldn't add coffee to cart", error.message),
  });

  const handleAddToCheckout = (data: IAddToCart) => {
    mutate(data);
  };

  return (
    <Pressable
      style={styles.orderButton}
      disabled={disabled || isPending}
      onPress={() => handleAddToCheckout({ coffeeId, variantId, quantity })}
    >
      <AppText
        weight={FONTS.bold}
        style={{
          color: COLORS.SURFACE.WHITE,
          fontSize: 16,
        }}
      >
        {isPending ? "Adding..." : "Add to cart"}
      </AppText>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  orderButton: {
    backgroundColor: COLORS.BRWON.NORMAL,
    minWidth: 180,
    paddingHorizontal: 20,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
  },
});
