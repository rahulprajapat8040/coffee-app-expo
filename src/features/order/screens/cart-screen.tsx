import { AppImage } from "@/components/common/media/app-image";
import { AppText } from "@/components/common/text/app-text";
import { COLORS } from "@/lib/constants/color.constant";
import { FONTS } from "@/lib/constants/font.constant";
import { ICartRes } from "@/lib/interfaces/cart/cart-res.interface";
import { orderApi } from "@/services/order.service";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Alert, FlatList, Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenHeader } from "@/components/common/navigation/screen-header";

const money = (value: number) => `$${value.toFixed(2)}`;

export const CartScreen = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["cart"],
    queryFn: orderApi.getMyCart,
  });
  const items = data?.data ?? [];
  const total = items.reduce(
    (sum, item) => sum + Number(item.variant.price) * item.quantity,
    0,
  );
  const unavailable = items.some(
    (item) => !item.coffee.isActive || item.variant.status !== "AVAILABLE",
  );
  const refreshCart = () =>
    queryClient.invalidateQueries({ queryKey: ["cart"] });

  const { mutate: changeQuantity } = useApiMutation(orderApi.updateQuantity, {
    onSuccess: refreshCart,
    onError: (error) => Alert.alert("Cart update failed", error.message),
  });
  const { mutate: removeItem } = useApiMutation(orderApi.removeFromCart, {
    onSuccess: refreshCart,
    onError: (error) => Alert.alert("Couldn't remove item", error.message),
  });

  const renderItem = ({ item }: { item: ICartRes }) => {
    const isAvailable =
      item.coffee.isActive && item.variant.status === "AVAILABLE";
    return (
      <View style={styles.itemCard}>
        {item.coffee.image ? (
          <AppImage src={item.coffee.image} style={styles.itemImage} />
        ) : (
          <View style={[styles.itemImage, styles.imagePlaceholder]}>
            <Ionicons
              name="cafe-outline"
              size={25}
              color={COLORS.BRWON.NORMAL}
            />
          </View>
        )}
        <View style={styles.itemInfo}>
          <View style={styles.itemTitleRow}>
            <View style={{ flex: 1 }}>
              <AppText weight={FONTS.semibold} numberOfLines={1}>
                {item.coffee.name}
              </AppText>
              <AppText style={styles.mutedText}>
                {item.variant.size}
                {!isAvailable ? " · Currently unavailable" : ""}
              </AppText>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Remove ${item.coffee.name} from cart`}
              onPress={() => removeItem(item.id)}
              hitSlop={8}
            >
              <Ionicons
                name="close"
                size={20}
                color={COLORS.GREY.LIGHT_HOVER}
              />
            </Pressable>
          </View>
          <View style={styles.itemBottomRow}>
            <AppText weight={FONTS.semibold} color={COLORS.BRWON.DARK}>
              {money(Number(item.variant.price) * item.quantity)}
            </AppText>
            <View style={styles.quantityControl}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Decrease quantity"
                onPress={() => {
                  if (item.quantity === 1) {
                    removeItem(item.id);
                    return;
                  }
                  changeQuantity({
                    cartItemId: item.id,
                    quantity: 1,
                    type: "desc",
                  });
                }}
                hitSlop={8}
              >
                <Ionicons
                  name="remove-circle-outline"
                  size={26}
                  color={COLORS.BRWON.NORMAL}
                />
              </Pressable>
              <AppText weight={FONTS.semibold}>{item.quantity}</AppText>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Increase quantity"
                onPress={() =>
                  changeQuantity({
                    cartItemId: item.id,
                    quantity: 1,
                    type: "asc",
                  })
                }
                hitSlop={8}
              >
                <Ionicons
                  name="add-circle"
                  size={26}
                  color={COLORS.BRWON.NORMAL}
                />
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
      <ScreenHeader title="Your cart" />
      {isError ? (
        <View style={styles.center}>
          <AppText>We couldn't load your cart.</AppText>
          <Pressable
            onPress={() =>
              queryClient.invalidateQueries({ queryKey: ["cart"] })
            }
          >
            <AppText style={styles.link}>Try again</AppText>
          </Pressable>
        </View>
      ) : isLoading ? (
        <View style={styles.center}>
          <AppText color={COLORS.GREY.LIGHT_HOVER}>Loading your cart…</AppText>
        </View>
      ) : items.length === 0 ? (
        <View style={styles.center}>
          <View style={styles.emptyIcon}>
            <Ionicons
              name="cafe-outline"
              size={34}
              color={COLORS.BRWON.NORMAL}
            />
          </View>
          <AppText size={20} weight={FONTS.semibold}>
            Your cart is waiting
          </AppText>
          <AppText color={COLORS.GREY.LIGHT_HOVER} style={styles.emptyCopy}>
            Find a favorite and we’ll have it freshly brewed for you.
          </AppText>
          <Pressable
            style={styles.primaryButton}
            onPress={() => router.replace("/home")}
          >
            <AppText color="#fff" weight={FONTS.semibold}>
              Explore the menu
            </AppText>
          </Pressable>
        </View>
      ) : (
        <>
          <FlatList
            data={items}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
            ListHeaderComponent={
              <View style={styles.listHeading}>
                <AppText size={20} weight={FONTS.semibold}>
                  Your picks
                </AppText>
                <AppText color={COLORS.GREY.LIGHT_HOVER}>
                  {items.length} {items.length === 1 ? "item" : "items"}
                </AppText>
              </View>
            }
          />
          {unavailable && (
            <View style={styles.warning}>
              <Ionicons
                name="information-circle-outline"
                size={18}
                color="#A44D2A"
              />
              <AppText style={styles.warningText}>
                Remove unavailable items before checking out.
              </AppText>
            </View>
          )}
          <View style={styles.footer}>
            <View>
              <AppText color={COLORS.GREY.LIGHT_HOVER}>Subtotal</AppText>
              <AppText size={20} weight={FONTS.bold}>
                {money(total)}
              </AppText>
            </View>
            <Pressable
              style={[
                styles.primaryButton,
                unavailable && styles.disabledButton,
              ]}
              disabled={unavailable}
              onPress={() => router.push("/checkout")}
            >
              <AppText color="#fff" weight={FONTS.semibold}>
                Continue
              </AppText>
              <Ionicons name="arrow-forward" size={17} color="#fff" />
            </Pressable>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F8F6F3" },
  listContent: { paddingHorizontal: 20, paddingBottom: 18 },
  listHeading: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },
  itemCard: {
    flexDirection: "row",
    gap: 13,
    padding: 12,
    borderRadius: 18,
    backgroundColor: "#fff",
  },
  itemImage: { width: 82, height: 82, borderRadius: 14 },
  imagePlaceholder: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.BRWON.LIGHT,
  },
  itemInfo: { flex: 1, justifyContent: "space-between", paddingVertical: 2 },
  itemTitleRow: { flexDirection: "row", alignItems: "flex-start", gap: 8 },
  itemBottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  mutedText: { color: COLORS.GREY.LIGHT_HOVER, fontSize: 12, marginTop: 4 },
  quantityControl: { flexDirection: "row", alignItems: "center", gap: 10 },
  warning: {
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 12,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FFF1E9",
  },
  warningText: { flex: 1, color: "#8B4426", fontSize: 12 },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 12,
    borderTopWidth: 1,
    borderTopColor: "#ECE7E2",
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  primaryButton: {
    minHeight: 48,
    minWidth: 145,
    paddingHorizontal: 20,
    borderRadius: 24,
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.BRWON.DARK,
  },
  disabledButton: { opacity: 0.45 },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 28,
  },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.BRWON.LIGHT,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },
  emptyCopy: {
    textAlign: "center",
    lineHeight: 21,
    marginTop: 8,
    marginBottom: 20,
  },
  link: { color: COLORS.BRWON.DARK, marginTop: 10, fontFamily: FONTS.semibold },
});
