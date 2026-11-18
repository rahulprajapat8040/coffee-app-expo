import { EditPencil } from "@/components/common/icons/svg";
import Button from "@/components/ui/button";
import { IAddressForm } from "@/lib/interfaces/address/address-form.interface";
import { IAddress } from "@/lib/interfaces/address/address-res.interface";
import { useRef } from "react";
import { AddressBottomSheetRef, AddressForm } from "./address-form";

export const EditAddressButton = ({ address }: { address: IAddress }) => {
  const addressSheetRef = useRef<AddressBottomSheetRef>(null);

  const defaultValues: IAddressForm = {
    nickName: address.nickName,
    address: address.address,
    latitude: address.latitude,
    longitude: address.longitude,
  };
  return (
    <>
      <Button
        onPress={() => addressSheetRef.current?.open()}
        size="small"
        variant={"ghost"}
      >
        <EditPencil />
      </Button>
      <AddressForm
        ref={addressSheetRef}
        id={address.id}
        defaultValues={defaultValues}
      />
    </>
  );
};
