import { AppImage } from "@/components/common/media/app-image";
import { AppText } from "@/components/common/text/app-text";
import { COLORS } from "@/lib/constants/color.constant";
import type { IOffer } from "@/lib/interfaces/home/home-res.interface";
import { ScrollView, StyleSheet, View } from "react-native";

export const OfferBanner = ({ offers }: { offers: IOffer[] }) => {
  if (!offers.length) return null;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.list}
    >
      {offers.map((offer) => (
        <View key={offer.id} style={styles.container}>
          <View style={styles.content}>
            <View style={styles.badge}>
              <AppText style={styles.badgeText}>
                {Number(offer.discountPercentage)}% OFF
              </AppText>
            </View>
            <AppText style={styles.heading} numberOfLines={2}>
              {offer.title}
            </AppText>
            {offer.description ? (
              <AppText style={styles.description} numberOfLines={2}>
                {offer.description}
              </AppText>
            ) : null}
          </View>

          {offer.image ? (
            <View style={styles.imageWrapper}>
              <AppImage src={offer.image} style={styles.image} />
            </View>
          ) : null}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  list: {
    gap: 12,
    paddingVertical: 18,
  },
  container: {
    width: 310,
    minHeight: 140,
    backgroundColor: COLORS.GREY.DARK,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#514037",
    paddingHorizontal: 18,
    paddingVertical: 28,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    overflow: "hidden",
  },

  content: {
    flex: 1,
    minWidth: 0,
    justifyContent: "center",
    gap: 7,
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
    fontSize: 19,
    fontWeight: "800",
    flexShrink: 1,
  },
  description: {
    color: "#E6DFD8",
    fontSize: 12,
    lineHeight: 17,
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
