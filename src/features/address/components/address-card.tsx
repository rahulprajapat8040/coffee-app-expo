import { Star } from "@/components/common/icons/svg";
import { AppText } from "@/components/common/text/app-text";
import { COLORS } from "@/lib/constants/color.constant";
import { FONT_SIZES, FONTS } from "@/lib/constants/font.constant";
import { IAddress } from "@/lib/interfaces/address/address-res.interface";
import { StyleSheet, View } from "react-native";
import { EditAddressButton } from "./edit-address-button";

export const AddressCard = ({ address }: { address: IAddress }) => {
  return (
    <View style={styles.container}>
      <View
        style={[
          styles.defaultAddress,
          address.isDefault
            ? {
                backgroundColor: COLORS.BRWON.NORMAL,
              }
            : {
                borderWidth: 1,
              },
        ]}
      >
        <Star
          size={18}
          color={address.isDefault ? COLORS.SURFACE.WHITE : COLORS.GREY.NORMAL}
        />
      </View>
      <View style={{ flex: 1 }}>
        <AppText size={FONT_SIZES.lg} weight={FONTS.semibold}>
          {address.nickName || "Address"}
        </AppText>
        <AppText color={COLORS.GREY.LIGHT_HOVER}>{address.address}</AppText>
      </View>
      <View style={{ width: 40 }}>
        <EditAddressButton address={address} />
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

  defaultAddress: {
    width: 28,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
  },
});
