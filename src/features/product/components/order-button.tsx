// import { IAddToCart } from "@/features/order/interfaces/order.interface";
// import { useApiMutation } from "@/hooks/use-api-mutation";
// import { Pressable, StyleSheet } from "react-native";
// import { coffeeApi } from "../api/coffee.api";
// import { orderApi } from "@/features/order/api/order.api";
// import { AppText } from "@/components/common/text/app-text";
// import { FONTS } from "@/lib/constants/font.constant";
// import { COLORS } from "@/lib/constants/color.constant";
// import { CheckoutNavigationProp } from "@/lib/interfaces/navigation.interface";

// interface Props {
//   navigation: CheckoutNavigationProp;
//   coffeeId: string;
//   variantId: string;
//   quantity?: number;
// }

// export const OrderButton = ({
//   navigation,
//   coffeeId,
//   variantId,
//   quantity = 1,
// }: Props) => {
//   const { mutate } = useApiMutation(orderApi.addToCart, {
//     onSuccess() {
//       navigation.navigate('Checkout');
//     },
//   });
//   const handleAddToCheckout = (data: IAddToCart) => {
//     mutate(data);
//   };
//   return (
//     <Pressable
//       style={styles.orderButton}
//       onPress={() => handleAddToCheckout({ coffeeId, variantId, quantity: 1 })}
//     >
//       <AppText
//         weight={FONTS.bold}
//         style={{
//           color: COLORS.SURFACE.WHITE,
//           fontSize: 16,
//         }}
//       >
//         Order
//       </AppText>
//     </Pressable>
//   );
// };

// const styles = StyleSheet.create({
//   orderButton: {
//     backgroundColor: COLORS.BRWON.NORMAL,
//     width: 240,
//     height: 52,
//     justifyContent: "center",
//     alignItems: "center",
//     borderRadius: 12,
//   },
// });
