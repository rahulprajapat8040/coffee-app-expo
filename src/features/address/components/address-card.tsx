import { AppText } from "@/components/common/text/app-text";
import { COLORS } from "@/lib/constants/color.constant";
import { FONT_SIZES, FONTS } from "@/lib/constants/font.constant";
import { IAddress } from "@/lib/interfaces/address/address-res.interface";
import { StyleSheet, View } from "react-native";
import { EditAddressButton } from "./edit-address-button";
import { SetDefaultAddress } from "./set-default-address-btn";

export const AddressCard = ({ address }: { address: IAddress }) => {
  return (
    <View style={styles.container}>
      <SetDefaultAddress id={address.id} isDefault={address.isDefault} />
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
});
