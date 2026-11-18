import { ScreenHeader } from "@/components/common/navigation/screen-header";
import { AppText } from "@/components/common/text/app-text";
import { COLORS } from "@/lib/constants/color.constant";
import { FONT_SIZES, FONTS } from "@/lib/constants/font.constant";
import { homeApi } from "@/services/home.service";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { ActivityIndicator, FlatList, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AddAddressButton } from "../components/add-address-button";
import { AddressCard } from "../components/address-card";

export const AddressScreen = () => {
  const insets = useSafeAreaInsets();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryFn: ({ pageParam }) =>
        homeApi.getAddress({
          page: pageParam,
        }),
      queryKey: ["address", "list"],
      initialPageParam: 1,
      getNextPageParam: (lastPage) => {
        const { page, totalPage } = lastPage.data.pageInfo;
        return page < totalPage ? page + 1 : undefined;
      },
    });

  const address = useMemo(
    () => data?.pages.flatMap((page) => page.data.data) ?? [],
    [data?.pages],
  );

  return (
    <View style={{ flex: 1 }}>
      <ScreenHeader title="Address" />

      <View style={{ flex: 1, paddingHorizontal: 18, gap: 12 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <AppText weight={FONTS.semibold} size={FONT_SIZES.lg}>
            Saved Addresses
          </AppText>
          <AddAddressButton />
        </View>

        <View style={{ flex: 1, marginTop: 8 }}>
          <FlatList
            data={address}
            style={{ flex: 1 }}
            contentContainerStyle={{
              paddingBottom: insets.bottom + 8,
            }}
            keyExtractor={(item) => String(item.id)}
            ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
            onEndReached={() => {
              if (hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
              }
            }}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              isFetchingNextPage ? (
                <ActivityIndicator
                  size="large"
                  color={COLORS.BRWON.NORMAL}
                  style={{ paddingVertical: 20 }}
                />
              ) : undefined
            }
            renderItem={({ item }) => <AddressCard address={item} />}
          />
        </View>
      </View>
    </View>
  );
};
