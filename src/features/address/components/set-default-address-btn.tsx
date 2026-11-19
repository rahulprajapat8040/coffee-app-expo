import { queryClient } from "@/api/query-client";
import { Star } from "@/components/common/icons/svg";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { COLORS } from "@/lib/constants/color.constant";
import { logger } from "@/lib/helper/logger.helper";
import { homeApi } from "@/services/home.service";
import { Pressable } from "react-native";

interface Props {
  id: string;
  isDefault: boolean;
}

export const SetDefaultAddress = ({ id, isDefault }: Props) => {
  const { mutate, isPending } = useApiMutation(homeApi.setAddressDefault, {
    onSuccess() {
      logger.log("Address updated successfully");
      queryClient.invalidateQueries({ queryKey: ["address", "list"] });
    },
    onError(err) {
      logger.log("Error in seting address default");
    },
  });

  return (
    <Pressable
      onPress={() => mutate(id)}
      disabled={isPending}
      style={[
        {
          width: 28,
          height: 28,
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 50,
        },
        isDefault
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
        color={isDefault ? COLORS.SURFACE.WHITE : COLORS.GREY.NORMAL}
      />
    </Pressable>
  );
};
