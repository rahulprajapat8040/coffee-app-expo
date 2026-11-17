import { AppText } from "@/components/common/text/app-text";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { COLORS } from "@/lib/constants/color.constant";
import { FONTS } from "@/lib/constants/font.constant";
import { IAddToCart } from "@/lib/interfaces/order/order-form.interface";
import { orderApi } from "@/services/order.service";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet } from "react-native";

interface Props {
  coffeeId: string;
  variantId: string;
  quantity?: number;
}

export const OrderButton = ({ coffeeId, variantId, quantity = 1 }: Props) => {
  const router = useRouter();
  const { mutate } = useApiMutation(orderApi.addToCart, {
    onSuccess() {
      router.push("/checkout");
    },
  });

  const handleAddToCheckout = (data: IAddToCart) => {
    mutate(data);
  };

  return (
    <Pressable
      style={styles.orderButton}
      onPress={() => handleAddToCheckout({ coffeeId, variantId, quantity })}
    >
      <AppText
        weight={FONTS.bold}
        style={{
          color: COLORS.SURFACE.WHITE,
          fontSize: 16,
        }}
      >
        Order
      </AppText>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  orderButton: {
    backgroundColor: COLORS.BRWON.NORMAL,
    width: 240,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
  },
});
