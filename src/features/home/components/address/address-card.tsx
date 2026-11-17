import { EditPencil, MapPin } from "@/components/common/icons/svg";
import { AppText } from "@/components/common/text/app-text";
import Button from "@/components/ui/button";
import { COLORS } from "@/lib/constants/color.constant";
import { FONT_SIZES, FONTS } from "@/lib/constants/font.constant";
import { IAddress } from "@/lib/interfaces/address/address-res.interface";
import { StyleSheet, View } from "react-native";

export const AddressCard = ({ address }: { address: IAddress }) => {
  return (
    <View style={styles.container}>
      <View style={styles.mapPin}>
        <MapPin size={20} color={COLORS.SURFACE.WHITE} />
      </View>
      <View style={{ flex: 1 }}>
        <AppText size={FONT_SIZES.lg} weight={FONTS.semibold}>
          {address.nickName || "Address"}
        </AppText>
        <AppText color={COLORS.GREY.LIGHT_HOVER}>{address.address}</AppText>
      </View>
      <View style={{ width: 40 }}>
        <Button size="small" variant={"ghost"}>
          <EditPencil />
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.SURFACE.WHITE,
    paddingHorizontal: 12,
    paddingVertical: 22,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
    borderRadius: 12,
    height: 130,
  },

  mapPin: {
    width: 38,
    height: 38,
    backgroundColor: COLORS.BRWON.NORMAL,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
  },
});
