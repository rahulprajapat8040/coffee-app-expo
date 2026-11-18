import { Plus } from "@/components/common/icons/svg";
import Button from "@/components/ui/button";
import { COLORS } from "@/lib/constants/color.constant";
import { IAddressForm } from "@/lib/interfaces/address/address-form.interface";
import { useRef } from "react";
import { View } from "react-native";
import { AddressBottomSheetRef, AddressForm } from "./address-form";

export const AddAddressButton = () => {
  const addressSheetRef = useRef<AddressBottomSheetRef>(null);

  const defaultValues: IAddressForm = {
    nickName: "",
    address: "",
    latitude: 23.222,
    longitude: 23.44,
  };

  return (
    <View>
      <Button
        style={{ width: 40, height: 40 }}
        onPress={() => addressSheetRef.current?.open()}
      >
        <Plus size={20} color={COLORS.SURFACE.WHITE} />
      </Button>

      <AddressForm ref={addressSheetRef} defaultValues={defaultValues} />
    </View>
  );
};
