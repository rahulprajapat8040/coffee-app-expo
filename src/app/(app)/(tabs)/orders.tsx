import { AppImage } from "@/components/common/media/app-image";
import { AppText } from "@/components/common/text/app-text";
import { COLORS } from "@/lib/constants/color.constant";
import { FONTS } from "@/lib/constants/font.constant";
import { IOrderRes } from "@/lib/interfaces/order/order-res.interface";
import { orderApi } from "@/services/order.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Alert, FlatList, Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const money = (value: string | number) => `$${Number(value).toFixed(2)}`;
const statusLabel = (status: IOrderRes["status"]) =>
  ({
    PREPARING: "In progress",
    ON_THE_WAY: "On the way",
    COMPLETED: "Delivered",
    CANCELLED: "Cancelled",
  })[status];

const OrderCard = ({
  order,
  onReorder,
  reordering,
}: {
  order: IOrderRes;
  onReorder: () => void;
  reordering: boolean;
}) => {
  const firstItem = order.items[0];
  const remaining = order.items.length - 1;
  const createdAt = new Date(order.createdAt);
  return (
    <View style={styles.orderCard}>
      <View style={styles.orderHeading}>
        <View style={styles.orderNumber}>
          <Ionicons
            name="receipt-outline"
            size={16}
            color={COLORS.BRWON.DARK}
          />
          <AppText weight={FONTS.semibold}>
            #{order.id.slice(0, 8).toUpperCase()}
          </AppText>
        </View>
        <View
          style={[
            styles.statusPill,
            order.status === "COMPLETED" && styles.completedPill,
            order.status === "CANCELLED" && styles.cancelledPill,
          ]}
        >
          <AppText size={10} weight={FONTS.semibold} color={COLORS.BRWON.DARK}>
            {statusLabel(order.status)}
          </AppText>
        </View>
      </View>
      <AppText
        size={11}
        color={COLORS.GREY.LIGHT_HOVER}
        style={{ marginTop: 5 }}
      >
        {createdAt.toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}{" "}
        ·{" "}
        {createdAt.toLocaleTimeString(undefined, {
          hour: "numeric",
          minute: "2-digit",
        })}
      </AppText>
      {firstItem && (
        <View style={styles.orderProduct}>
          {firstItem.image ? (
            <AppImage src={firstItem.image} style={styles.productImage} />
          ) : (
            <View style={[styles.productImage, styles.imagePlaceholder]}>
              <Ionicons
                name="cafe-outline"
                size={20}
                color={COLORS.BRWON.NORMAL}
              />
            </View>
          )}
          <View style={{ flex: 1 }}>
            <AppText weight={FONTS.semibold} numberOfLines={1}>
              {firstItem.quantity}x {firstItem.name}
            </AppText>
            <AppText
              size={11}
              color={COLORS.GREY.LIGHT_HOVER}
              style={{ marginTop: 3 }}
            >
              {firstItem.size}
              {remaining > 0 ? ` · +${remaining} more` : ""}
            </AppText>
          </View>
          <AppText weight={FONTS.semibold}>{money(order.total)}</AppText>
        </View>
      )}
      <View style={styles.orderFooter}>
        <View style={styles.addressSummary}>
          <Ionicons
            name="location-outline"
            size={15}
            color={COLORS.GREY.LIGHT_HOVER}
          />
          <AppText
            size={11}
            color={COLORS.GREY.LIGHT_HOVER}
            numberOfLines={1}
            style={{ flex: 1 }}
          >
            {order.deliveryAddress}
          </AppText>
        </View>
        {order.status === "COMPLETED" && (
          <Pressable
            style={[styles.reorderButton, reordering && { opacity: 0.6 }]}
            disabled={reordering}
            onPress={onReorder}
          >
            <Ionicons name="refresh" size={14} color="#fff" />
            <AppText size={11} weight={FONTS.semibold} color="#fff">
              {reordering ? "Adding..." : "Reorder"}
            </AppText>
          </Pressable>
        )}
      </View>
    </View>
  );
};

const OrdersScreen = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["orders"],
    queryFn: orderApi.getMyOrders,
    refetchInterval: 30_000,
  });
  const orders = data?.data ?? [];
  const activeCount = orders.filter(
    (order) => order.status === "PREPARING" || order.status === "ON_THE_WAY",
  ).length;
  const reorder = useMutation({
    mutationFn: async (order: IOrderRes) => {
      await Promise.all(
        order.items.map((item) =>
          orderApi.addToCart({
            coffeeId: item.coffeeId,
            variantId: item.variantId,
            quantity: item.quantity,
          }),
        ),
      );
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["cart"] });
      router.push("/cart");
    },
    onError: (error) =>
      Alert.alert("Couldn't reorder these items", error.message),
  });

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <View style={styles.header}>
        <View style={styles.headerMark}>
          <Ionicons name="cafe" size={16} color="#fff" />
        </View>
        <View style={{ flex: 1 }}>
          <AppText size={20} weight={FONTS.semibold}>
            Order history
          </AppText>
          <AppText size={12} color={COLORS.GREY.LIGHT_HOVER}>
            Every cup, all in one place
          </AppText>
        </View>
        <Pressable
          onPress={() => router.push("/profile")}
          style={styles.headerButton}
        >
          <Ionicons name="person-outline" size={18} color={COLORS.BRWON.DARK} />
        </Pressable>
      </View>
      <View style={styles.tabs}>
        <View style={styles.activeTab}>
          <AppText color="#fff" weight={FONTS.semibold} size={12}>
            All orders
          </AppText>
          <View style={styles.countBadge}>
            <AppText
              color={COLORS.BRWON.DARK}
              size={10}
              weight={FONTS.semibold}
            >
              {orders.length}
            </AppText>
          </View>
        </View>
        <View style={styles.inactiveTab}>
          <AppText color={COLORS.GREY.LIGHT_HOVER} size={12}>
            In progress ({activeCount})
          </AppText>
        </View>
      </View>
      {isError ? (
        <View style={styles.center}>
          <Ionicons
            name="cloud-offline-outline"
            size={32}
            color={COLORS.BRWON.NORMAL}
          />
          <AppText style={{ marginTop: 10 }}>
            We couldn't load your orders.
          </AppText>
        </View>
      ) : isLoading ? (
        <View style={styles.center}>
          <AppText color={COLORS.GREY.LIGHT_HOVER}>
            Loading your orders...
          </AppText>
        </View>
      ) : orders.length ? (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <OrderCard
              order={item}
              onReorder={() => reorder.mutate(item)}
              reordering={reorder.isPending}
            />
          )}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={{ height: 13 }} />}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.center}>
          <View style={styles.emptyIcon}>
            <Ionicons
              name="receipt-outline"
              size={32}
              color={COLORS.BRWON.NORMAL}
            />
          </View>
          <AppText size={18} weight={FONTS.semibold}>
            No orders yet
          </AppText>
          <AppText style={styles.emptyCopy} color={COLORS.GREY.LIGHT_HOVER}>
            Your next favorite brew is only a few taps away.
          </AppText>
          <Pressable
            style={styles.shopButton}
            onPress={() => router.replace("/home")}
          >
            <AppText color="#fff" weight={FONTS.semibold}>
              Explore coffee
            </AppText>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
};

export default OrdersScreen;

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F8F6F3" },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerMark: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: COLORS.BRWON.DARK,
    alignItems: "center",
    justifyContent: "center",
  },
  headerButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  tabs: {
    marginHorizontal: 20,
    marginBottom: 17,
    padding: 4,
    borderRadius: 24,
    flexDirection: "row",
    backgroundColor: "#EEEAE6",
  },
  activeTab: {
    flex: 1,
    minHeight: 38,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    backgroundColor: COLORS.BRWON.DARK,
  },
  countBadge: {
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  inactiveTab: { flex: 1, alignItems: "center", justifyContent: "center" },
  list: { paddingHorizontal: 20, paddingBottom: 22 },
  orderCard: { backgroundColor: "#fff", borderRadius: 18, padding: 15 },
  orderHeading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  orderNumber: { flexDirection: "row", alignItems: "center", gap: 7 },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: "#FCE9DC",
  },
  completedPill: { backgroundColor: "#EDEAE7" },
  cancelledPill: { backgroundColor: "#FBE5E2" },
  orderProduct: {
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
    paddingVertical: 14,
    marginTop: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#F1ECE7",
  },
  productImage: { width: 58, height: 58, borderRadius: 12 },
  imagePlaceholder: {
    backgroundColor: COLORS.BRWON.LIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  orderFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    paddingTop: 12,
  },
  addressSummary: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  reorderButton: {
    borderRadius: 18,
    paddingHorizontal: 11,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: COLORS.BRWON.DARK,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 28,
  },
  emptyIcon: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: COLORS.BRWON.LIGHT,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  emptyCopy: { textAlign: "center", marginTop: 7, marginBottom: 18 },
  shopButton: {
    backgroundColor: COLORS.BRWON.DARK,
    borderRadius: 22,
    paddingHorizontal: 22,
    paddingVertical: 12,
  },
});
