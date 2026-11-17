import { Plus } from "@/components/common/icons/svg";
import { AppImage } from "@/components/common/media/app-image";
import { AppText } from "@/components/common/text/app-text";
import { COLORS } from "@/lib/constants/color.constant";
import { FONT_SIZES, FONTS } from "@/lib/constants/font.constant";
import { ICoffee } from "@/lib/interfaces/coffes.interface";
import { Pressable, StyleSheet, View } from "react-native";

interface ProductProp extends ICoffee {
  onPress?: () => void;
}

export const ProductCard = ({
  name,
  category,
  image,
  onPress,
}: ProductProp) => {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      <AppImage style={styles.productImage} src={image} />
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
          {category.name}
        </AppText>
        <View
          style={{
            marginTop: 4,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <AppText style={{ fontWeight: "bold", fontSize: 16 }}>
            $ {4.53}
          </AppText>
          <Pressable
            style={{
              width: 44,
              height: 44,
              backgroundColor: COLORS.BRWON.NORMAL,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 12,
            }}
          >
            <Plus color={COLORS.SURFACE.WHITE} />
          </Pressable>
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
    width: "50%",
  },

  productImage: {
    width: "100%",
    height: 150,
    borderRadius: 12,
  },
});
