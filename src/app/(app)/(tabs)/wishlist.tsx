import { AppImage } from "@/components/common/media/app-image";
import { AppText } from "@/components/common/text/app-text";
import Button from "@/components/ui/button";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { COLORS } from "@/lib/constants/color.constant";
import { FONTS } from "@/lib/constants/font.constant";
import { IWishlistItem, orderApi } from "@/services/order.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Alert, FlatList, Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Wishlist = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["wishlist"],
    queryFn: orderApi.getWishlist,
  });
  const items = data?.data ?? [];

  const { mutate: removeItem } = useApiMutation(orderApi.removeFromWishlist, {
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["wishlist"] }),
    onError: (error) => Alert.alert("Couldn't update wishlist", error.message),
  });
  const addToCart = useMutation({
    mutationFn: orderApi.addToCart,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["cart"] });
      router.push("/cart");
    },
    onError: (error) =>
      Alert.alert("Couldn't add coffee to cart", error.message),
  });

  const renderItem = ({ item }: { item: IWishlistItem }) => {
    const variant = item.coffee.variants.find(
      (option) => option.status === "AVAILABLE",
    );
    const isAvailable = item.coffee.isActive && !!variant;
    return (
      <View style={styles.card}>
        <Pressable
          style={styles.productRow}
          onPress={() =>
            router.push({
              pathname: "/product/[id]",
              params: { id: item.coffeeId },
            })
          }
        >
          {item.coffee.image ? (
            <AppImage src={item.coffee.image} style={styles.image} />
          ) : (
            <View style={[styles.image, styles.imagePlaceholder]}>
              <Ionicons
                name="cafe-outline"
                size={25}
                color={COLORS.BRWON.NORMAL}
              />
            </View>
          )}
          <View style={styles.details}>
            <AppText weight={FONTS.semibold} numberOfLines={1}>
              {item.coffee.name}
            </AppText>
            <AppText
              size={12}
              color={COLORS.GREY.LIGHT_HOVER}
              numberOfLines={2}
            >
              {item.coffee.description}
            </AppText>
            <AppText weight={FONTS.semibold} color={COLORS.BRWON.DARK}>
              {variant ? `$${Number(variant.price).toFixed(2)}` : "Unavailable"}
            </AppText>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Remove ${item.coffee.name} from wishlist`}
            onPress={() => removeItem(item.coffeeId)}
            hitSlop={8}
          >
            <Ionicons name="heart" size={21} color={COLORS.BRWON.DARK} />
          </Pressable>
        </Pressable>
        <Button
          size="small"
          fullWidth
          disabled={!isAvailable || addToCart.isPending}
          onPress={() => {
            if (variant) {
              addToCart.mutate({
                coffeeId: item.coffeeId,
                variantId: variant.id,
                quantity: 1,
              });
            }
          }}
        >
          <Ionicons name="bag-add-outline" size={16} color="#fff" />
          <AppText color="#fff" weight={FONTS.semibold}>
            {isAvailable ? "Add to cart" : "Currently unavailable"}
          </AppText>
        </Button>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <View style={styles.header}>
        <AppText size={22} weight={FONTS.semibold}>
          Saved coffee
        </AppText>
        <AppText color={COLORS.GREY.LIGHT_HOVER} style={{ marginTop: 4 }}>
          Your next cup, ready when you are
        </AppText>
      </View>
      {isError ? (
        <View style={styles.center}>
          <Ionicons
            name="cloud-offline-outline"
            size={32}
            color={COLORS.BRWON.NORMAL}
          />
          <AppText style={{ marginTop: 10 }}>
            We couldn't load your wishlist.
          </AppText>
        </View>
      ) : isLoading ? (
        <View style={styles.center}>
          <AppText color={COLORS.GREY.LIGHT_HOVER}>
            Loading your saved coffee...
          </AppText>
        </View>
      ) : items.length ? (
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={{ height: 13 }} />}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.center}>
          <View style={styles.emptyIcon}>
            <Ionicons
              name="heart-outline"
              size={34}
              color={COLORS.BRWON.NORMAL}
            />
          </View>
          <AppText size={18} weight={FONTS.semibold}>
            Make room for a favorite
          </AppText>
          <AppText style={styles.emptyCopy} color={COLORS.GREY.LIGHT_HOVER}>
            Tap the heart on a coffee to save it here.
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

export default Wishlist;

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F8F6F3" },
  header: { paddingHorizontal: 20, paddingTop: 21, paddingBottom: 18 },
  list: { paddingHorizontal: 20, paddingBottom: 24 },
  card: { padding: 13, borderRadius: 18, backgroundColor: "#fff" },
  productRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 13,
  },
  image: { width: 84, height: 84, borderRadius: 14 },
  imagePlaceholder: {
    backgroundColor: COLORS.BRWON.LIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  details: { flex: 1, gap: 5 },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 28,
  },
  emptyIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
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
