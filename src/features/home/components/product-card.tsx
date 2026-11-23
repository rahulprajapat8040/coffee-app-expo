import { AppImage } from "@/components/common/media/app-image";
import { AppText } from "@/components/common/text/app-text";
import { COLORS } from "@/lib/constants/color.constant";
import { FONT_SIZES, FONTS } from "@/lib/constants/font.constant";
import { ICoffee } from "@/lib/interfaces/coffes.interface";
import type { IOffer } from "@/lib/interfaces/home/home-res.interface";
import { getOfferDiscountCents } from "@/lib/helper/offer.helper";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, View } from "react-native";

interface ProductProp extends ICoffee {
  onPress?: () => void;
  onAddToCart?: () => void;
  onDecreaseQuantity?: () => void;
  cartQuantity?: number;
  isCartUpdating?: boolean;
  offer?: IOffer | null;
}

export const ProductCard = ({
  name,
  category,
  image,
  variants,
  onPress,
  onAddToCart,
  onDecreaseQuantity,
  cartQuantity = 0,
  isCartUpdating = false,
  offer,
}: ProductProp) => {
  const availableVariant = variants.find(
    (variant) => variant.status === "AVAILABLE",
  );
  const originalPriceCents = availableVariant
    ? Math.round(Number(availableVariant.price) * 100)
    : 0;
  const discountCents = getOfferDiscountCents(
    originalPriceCents,
    offer?.discountPercentage,
  );
  return (
    <Pressable onPress={onPress} style={styles.card}>
      <AppImage style={styles.productImage} src={image} />
      {offer && discountCents > 0 ? (
        <View style={styles.offerBadge}>
          <AppText style={styles.offerBadgeText}>
            {Number(offer.discountPercentage)}% OFF
          </AppText>
        </View>
      ) : null}
      <View style={{ marginTop: 6 }}>
        <AppText
          size={FONT_SIZES.base}
          weight={FONTS.semibold}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {name}
        </AppText>
        <AppText color={COLORS.GREY.LIGHT} size={FONT_SIZES.md}>
          {category?.name ?? "Coffee"}
        </AppText>
        <View
          style={{
            marginTop: 4,
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
          }}
        >
          <View style={styles.priceBlock}>
            <AppText
              numberOfLines={1}
              style={styles.price}
            >
              {availableVariant
                ? `$ ${((originalPriceCents - discountCents) / 100).toFixed(2)}`
                : "Unavailable"}
            </AppText>
            {discountCents > 0 ? (
              <AppText style={styles.originalPrice}>
                `$ ${Number(availableVariant?.price).toFixed(2)}`
              </AppText>
            ) : null}
          </View>
          {cartQuantity > 0 ? (
            <View style={styles.quantityControl}>
              <Pressable
                disabled={isCartUpdating}
                onPress={(event) => {
                  event.stopPropagation();
                  onDecreaseQuantity?.();
                }}
                accessibilityRole="button"
                accessibilityLabel={`Remove one ${name} from cart`}
                style={styles.quantityButton}
              >
                <Ionicons name="remove" size={16} color={COLORS.BRWON.DARK} />
              </Pressable>
              <AppText
                size={FONT_SIZES.sm}
                weight={FONTS.semibold}
                style={styles.quantityLabel}
              >
                {cartQuantity}
              </AppText>
              <Pressable
                disabled={isCartUpdating || !availableVariant}
                onPress={(event) => {
                  event.stopPropagation();
                  onAddToCart?.();
                }}
                accessibilityRole="button"
                accessibilityLabel={`Add another ${name} to cart`}
                style={[
                  styles.quantityButton,
                  styles.quantityAddButton,
                  !availableVariant && styles.disabledButton,
                ]}
              >
                <Ionicons name="add" size={16} color={COLORS.SURFACE.WHITE} />
              </Pressable>
            </View>
          ) : (
            <Pressable
              disabled={!availableVariant || isCartUpdating}
              onPress={(event) => {
                event.stopPropagation();
                onAddToCart?.();
              }}
              accessibilityRole="button"
              accessibilityLabel={`Add ${name} to cart`}
              style={[
                styles.addButton,
                (!availableVariant || isCartUpdating) && styles.disabledButton,
              ]}
            >
              <Ionicons name="add" size={18} color={COLORS.SURFACE.WHITE} />
            </Pressable>
          )}
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 8,
    marginBottom: 12,
    flex: 1,
    maxWidth: "50%",
    position: "relative",
  },

  productImage: {
    width: "100%",
    height: 150,
    borderRadius: 12,
  },
  offerBadge: {
    position: "absolute",
    top: 14,
    left: 14,
    zIndex: 1,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: "#E65046",
  },
  offerBadgeText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "700",
  },
  priceBlock: {
    flex: 1,
    justifyContent: "center",
  },
  price: {
    fontWeight: "bold",
    fontSize: FONT_SIZES.md,
    color: COLORS.BRWON.DARK,
  },
  originalPrice: {
    color: COLORS.GREY.LIGHT_HOVER,
    fontSize: 10,
    textDecorationLine: "line-through",
  },
  addButton: {
    width: 36,
    height: 36,
    backgroundColor: COLORS.BRWON.NORMAL,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 11,
  },
  quantityControl: {
    height: 36,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    padding: 4,
    borderRadius: 12,
    backgroundColor: COLORS.BRWON.LIGHT,
  },
  quantityButton: {
    width: 26,
    height: 26,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 9,
    backgroundColor: "#fff",
  },
  quantityAddButton: { backgroundColor: COLORS.BRWON.NORMAL },
  quantityLabel: { minWidth: 16, textAlign: "center" },
  disabledButton: { opacity: 0.45 },
});
