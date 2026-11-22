import { AppImage } from "@/components/common/media/app-image";
import { AppText } from "@/components/common/text/app-text";
import { ScreenHeader } from "@/components/common/navigation/screen-header";
import { COLORS } from "@/lib/constants/color.constant";
import { FONTS } from "@/lib/constants/font.constant";
import { ICartRes } from "@/lib/interfaces/cart/cart-res.interface";
import { homeApi } from "@/services/home.service";
import { orderApi } from "@/services/order.service";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const DELIVERY_FEE = 1;
const SERVICE_FEE = 0.4;
const money = (value: number) => `$${value.toFixed(2)}`;

export const CheckoutScreen = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [note, setNote] = useState("");
  const cartQuery = useQuery({
    queryKey: ["cart"],
    queryFn: orderApi.getMyCart,
  });
  const addressQuery = useQuery({
    queryKey: ["address", "list", "checkout"],
    queryFn: () => homeApi.getAddress({ page: 1 }),
  });
  const cart = cartQuery.data?.data ?? [];
  const addresses = addressQuery.data?.data.data ?? [];
  const selectedAddress = addresses.find(
    (address) => address.id === selectedAddressId,
  );
  const unavailable = cart.some(
    (item) => !item.coffee.isActive || item.variant.status !== "AVAILABLE",
  );
  const subtotal = useMemo(
    () =>
      cart.reduce(
        (sum, item) => sum + Number(item.variant.price) * item.quantity,
        0,
      ),
    [cart],
  );
  const total = subtotal + DELIVERY_FEE + SERVICE_FEE;

  useEffect(() => {
    if (!selectedAddressId && addresses.length) {
      setSelectedAddressId(
        addresses.find((address) => address.isDefault)?.id ?? addresses[0].id,
      );
    }
  }, [addresses, selectedAddressId]);

  const { mutate: placeOrder, isPending } = useApiMutation(
    orderApi.createOrder,
    {
      onSuccess: async () => {
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ["cart"] }),
          queryClient.invalidateQueries({ queryKey: ["orders"] }),
        ]);
        router.replace("/(app)/(tabs)/orders");
      },
      onError: (error) =>
        Alert.alert("Couldn't place your order", error.message),
    },
  );

  const renderItem = (item: ICartRes) => (
    <View key={item.id} style={styles.orderItem}>
      {item.coffee.image ? (
        <AppImage src={item.coffee.image} style={styles.itemImage} />
      ) : (
        <View style={[styles.itemImage, styles.imagePlaceholder]}>
          <Ionicons name="cafe-outline" size={22} color={COLORS.BRWON.NORMAL} />
        </View>
      )}
      <View style={styles.itemDescription}>
        <AppText weight={FONTS.semibold} numberOfLines={1}>
          {item.coffee.name}
        </AppText>
        <AppText style={styles.mutedText}>
          {item.variant.size} · Qty {item.quantity}
        </AppText>
      </View>
      <AppText weight={FONTS.semibold} color={COLORS.BRWON.DARK}>
        {money(Number(item.variant.price) * item.quantity)}
      </AppText>
    </View>
  );

  const canPlaceOrder =
    cart.length > 0 && !!selectedAddressId && !unavailable && !isPending;

  return (
    <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
      <ScreenHeader title="Order checkout" />
      {cartQuery.isLoading ? (
        <View style={styles.center}>
          <AppText color={COLORS.GREY.LIGHT_HOVER}>Loading checkout...</AppText>
        </View>
      ) : cart.length === 0 ? (
        <View style={styles.center}>
          <Ionicons
            name="bag-handle-outline"
            size={42}
            color={COLORS.BRWON.NORMAL}
          />
          <AppText size={18} weight={FONTS.semibold} style={{ marginTop: 12 }}>
            Your cart is empty
          </AppText>
          <Pressable
            onPress={() => router.replace("/cart")}
            style={styles.textButton}
          >
            <AppText color={COLORS.BRWON.DARK} weight={FONTS.semibold}>
              Back to cart
            </AppText>
          </Pressable>
        </View>
      ) : (
        <>
          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.deliveryCard}>
              <View style={styles.sectionTitle}>
                <View style={styles.sectionIcon}>
                  <Ionicons
                    name="location"
                    size={17}
                    color={COLORS.BRWON.DARK}
                  />
                </View>
                <AppText size={16} weight={FONTS.semibold}>
                  Delivery address
                </AppText>
              </View>
              {addressQuery.isError ? (
                <AppText style={styles.warningText}>
                  Couldn't load saved addresses.
                </AppText>
              ) : addresses.length ? (
                addresses.map((address) => {
                  const selected = address.id === selectedAddressId;
                  return (
                    <Pressable
                      key={address.id}
                      style={[
                        styles.addressOption,
                        selected && styles.selectedAddress,
                      ]}
                      onPress={() => setSelectedAddressId(address.id)}
                    >
                      <View style={{ flex: 1 }}>
                        <AppText weight={FONTS.semibold}>
                          {address.nickName || "Saved address"}
                        </AppText>
                        <AppText style={styles.mutedText} numberOfLines={2}>
                          {address.address}
                        </AppText>
                      </View>
                      <Ionicons
                        name={selected ? "radio-button-on" : "radio-button-off"}
                        size={20}
                        color={selected ? COLORS.BRWON.DARK : "#B8B1AA"}
                      />
                    </Pressable>
                  );
                })
              ) : (
                <View style={styles.noAddress}>
                  <AppText color={COLORS.GREY.LIGHT_HOVER}>
                    Add a delivery address to continue.
                  </AppText>
                  <Pressable onPress={() => router.push("/address")}>
                    <AppText color={COLORS.BRWON.DARK} weight={FONTS.semibold}>
                      Add address
                    </AppText>
                  </Pressable>
                </View>
              )}
              {selectedAddress && (
                <View style={styles.deliveryEta}>
                  <Ionicons
                    name="flash-outline"
                    size={15}
                    color={COLORS.BRWON.DARK}
                  />
                  <AppText size={12} color={COLORS.BRWON.DARK}>
                    Freshly brewed and delivered in 15-20 min
                  </AppText>
                </View>
              )}
            </View>

            <View style={styles.sectionHeading}>
              <AppText size={16} weight={FONTS.semibold}>
                Order items
              </AppText>
              <Pressable onPress={() => router.replace("/cart")}>
                <AppText size={12} color={COLORS.BRWON.DARK}>
                  Edit cart
                </AppText>
              </Pressable>
            </View>
            <View style={styles.itemsCard}>{cart.map(renderItem)}</View>

            <View style={styles.noteCard}>
              <AppText size={16} weight={FONTS.semibold}>
                A note for the courier?
              </AppText>
              <TextInput
                value={note}
                onChangeText={setNote}
                placeholder="Door code, leave at the door..."
                placeholderTextColor="#A39A92"
                maxLength={300}
                multiline
                style={styles.noteInput}
              />
            </View>

            <View style={styles.paymentCard}>
              <View style={styles.paymentIcon}>
                <Ionicons
                  name="cash-outline"
                  size={19}
                  color={COLORS.BRWON.DARK}
                />
              </View>
              <View style={{ flex: 1 }}>
                <AppText size={15} weight={FONTS.semibold}>
                  Cash on delivery
                </AppText>
                <AppText
                  size={11}
                  color={COLORS.GREY.LIGHT_HOVER}
                  style={{ marginTop: 4 }}
                >
                  Pay when your order arrives
                </AppText>
              </View>
              <Ionicons
                name="checkmark-circle"
                size={20}
                color={COLORS.BRWON.NORMAL}
              />
            </View>

            <View style={styles.summaryCard}>
              <AppText
                size={16}
                weight={FONTS.semibold}
                style={{ marginBottom: 15 }}
              >
                Payment summary
              </AppText>
              <SummaryLine label="Order subtotal" value={money(subtotal)} />
              <SummaryLine label="Delivery fee" value={money(DELIVERY_FEE)} />
              <SummaryLine label="Service fee" value={money(SERVICE_FEE)} />
              <View style={styles.summaryDivider} />
              <SummaryLine label="Total payment" value={money(total)} strong />
            </View>
            {unavailable && (
              <View style={styles.unavailableNotice}>
                <Ionicons
                  name="alert-circle-outline"
                  size={17}
                  color="#A44D2A"
                />
                <AppText style={styles.warningText}>
                  An item is unavailable. Remove it from your cart to continue.
                </AppText>
              </View>
            )}
          </ScrollView>
          <View style={styles.footer}>
            <View>
              <AppText size={12} color={COLORS.GREY.LIGHT_HOVER}>
                Total
              </AppText>
              <AppText size={20} weight={FONTS.bold} color={COLORS.BRWON.DARK}>
                {money(total)}
              </AppText>
            </View>
            <Pressable
              disabled={!canPlaceOrder}
              onPress={() =>
                placeOrder({
                  addressId: selectedAddressId,
                  note: note.trim() || undefined,
                })
              }
              style={[
                styles.placeButton,
                !canPlaceOrder && styles.disabledButton,
              ]}
            >
              <AppText color="#fff" weight={FONTS.semibold}>
                {isPending ? "Placing order..." : "Place order"}
              </AppText>
              {!isPending && (
                <Ionicons name="arrow-forward" size={17} color="#fff" />
              )}
            </Pressable>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

const SummaryLine = ({
  label,
  value,
  strong,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) => (
  <View style={styles.summaryLine}>
    <AppText
      weight={strong ? FONTS.semibold : FONTS.regular}
      color={strong ? COLORS.GREY.DARK : COLORS.GREY.LIGHT_HOVER}
    >
      {label}
    </AppText>
    <AppText
      weight={strong ? FONTS.bold : FONTS.medium}
      color={strong ? COLORS.BRWON.DARK : COLORS.GREY.DARK}
      size={strong ? 17 : 14}
    >
      {value}
    </AppText>
  </View>
);

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F8F6F3" },
  content: { paddingHorizontal: 18, paddingBottom: 22 },
  deliveryCard: {
    padding: 16,
    borderRadius: 18,
    backgroundColor: "#fff",
    marginBottom: 22,
  },
  sectionTitle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    marginBottom: 13,
  },
  sectionIcon: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: COLORS.BRWON.LIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  addressOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: "#EEE9E4",
    borderRadius: 13,
    padding: 12,
    marginBottom: 9,
  },
  selectedAddress: {
    borderColor: COLORS.BRWON.NORMAL,
    backgroundColor: "#FFFCF9",
  },
  mutedText: {
    color: COLORS.GREY.LIGHT_HOVER,
    fontSize: 12,
    marginTop: 4,
    lineHeight: 18,
  },
  deliveryEta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingTop: 10,
    marginTop: 3,
    borderTopWidth: 1,
    borderTopColor: "#F1ECE7",
  },
  noAddress: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionHeading: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  itemsCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    paddingHorizontal: 14,
    marginBottom: 18,
  },
  orderItem: {
    minHeight: 88,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1ECE7",
  },
  itemImage: { width: 58, height: 58, borderRadius: 12 },
  imagePlaceholder: {
    backgroundColor: COLORS.BRWON.LIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  itemDescription: { flex: 1 },
  noteCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    marginBottom: 18,
  },
  noteInput: {
    marginTop: 12,
    minHeight: 48,
    maxHeight: 90,
    borderRadius: 12,
    backgroundColor: "#F8F6F3",
    color: COLORS.GREY.DARK,
    padding: 12,
    fontFamily: FONTS.regular,
    fontSize: 13,
    textAlignVertical: "top",
  },
  paymentCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    marginBottom: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
  },
  paymentIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.BRWON.LIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  summaryCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 17,
    marginBottom: 12,
  },
  summaryLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  summaryDivider: {
    borderTopWidth: 1,
    borderTopColor: "#EEE9E4",
    marginVertical: 5,
  },
  unavailableNotice: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#FFF1E9",
  },
  warningText: { flex: 1, color: "#8B4426", fontSize: 12 },
  footer: {
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 8,
    borderTopWidth: 1,
    borderTopColor: "#ECE7E2",
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  placeButton: {
    minHeight: 48,
    minWidth: 175,
    paddingHorizontal: 18,
    borderRadius: 25,
    backgroundColor: COLORS.BRWON.DARK,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  disabledButton: { opacity: 0.45 },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  textButton: { marginTop: 14 },
});
