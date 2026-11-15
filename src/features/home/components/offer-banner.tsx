import { AppText } from "@/components/common/text/app-text";
import { COLORS } from "@/lib/constants/color.constant";
import { Image, StyleSheet, View } from "react-native";

export const OfferBanner = () => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.badgeRow}>
          <View style={styles.badge}>
            <AppText style={styles.badgeText}>LIMITED DROP</AppText>
          </View>
        </View>

        <AppText style={styles.heading}>Buy one get one FREE</AppText>
      </View>

      <View style={styles.imageWrapper}>
        <Image
          style={styles.image}
          resizeMode="cover"
          source={{
            uri: "https://img.magnific.com/free-photo/latte-coffee_1122-2728.jpg?semt=ais_hybrid&w=740&q=80",
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: COLORS.GREY.DARK,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#514037",
    paddingHorizontal: 18,
    paddingVertical: 28,
    marginVertical: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    overflow: "hidden",
  },

  content: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },

  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  badge: {
    backgroundColor: "#F04D50",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 50,
    alignSelf: "flex-start",
  },

  badgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
  },

  heading: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "800",
    flexShrink: 1,
  },

  imageWrapper: {
    width: 100,
    height: 100,
    flexShrink: 0,
    padding: 4,
    borderRadius: 20,
    backgroundColor: COLORS.GREY.NORMAL,
  },

  image: {
    width: "100%",
    height: "100%",
    borderRadius: 16,
  },
});
