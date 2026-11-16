import { COLORS } from "@/lib/constants/color.constant";
import { homeApi } from "@/services/home.service";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { ActivityIndicator, FlatList, View } from "react-native";
import { Categories } from "../components/categories";
import { HomeHeader } from "../components/home-header";
import { OfferBanner } from "../components/offer-banner";
import { ProductCard } from "../components/product-card";

export const HomeScreen = () => {
  const router = useRouter();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryFn: ({ pageParam }) =>
        homeApi.getCoffees({
          categoryId: selectedCategoryId,
          page: pageParam,
        }),
      queryKey: ["home", "products", selectedCategoryId],
      initialPageParam: 1,
      getNextPageParam: (lastPage) => {
        const { page, totalPage } = lastPage.data.pageInfo;
        return page < totalPage ? page + 1 : undefined;
      },
    });

  const products = useMemo(
    () => data?.pages.flatMap((page) => page.data.data),
    [data?.pages],
  );

  return (
    <FlatList
      key="products-2-columns"
      data={products}
      numColumns={2}
      contentContainerStyle={{
        paddingBottom: 30,
        backgroundColor: COLORS.SURFACE.LIGHT,
      }}
      columnWrapperStyle={{
        gap: 12,
        paddingHorizontal: 20,
      }}
      keyExtractor={(item) => item.id}
      onEndReached={() => {
        if (hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      }}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        isFetchingNextPage ? (
          <ActivityIndicator
            size={"large"}
            color={COLORS.BRWON.NORMAL}
            style={{ paddingVertical: 20 }}
          />
        ) : undefined
      }
      ListHeaderComponent={
        <>
          <HomeHeader />
          <View style={{ paddingHorizontal: 18, gap: 12 }}>
            <OfferBanner />
            <Categories
              activeId={selectedCategoryId}
              onPress={(id) => setSelectedCategoryId(id)}
            />
          </View>
        </>
      }
      renderItem={({ item }) => (
        <ProductCard
          {...item}
          onPress={() =>
            router.push({
              pathname: "/product/[id]",
              params: {
                id: String(item.id),
              },
            })
          }
        />
      )}
    />
  );
};

// <View style={{ flex: 1 }}>
//   <HomeHeader />

//   <View style={{ paddingHorizontal: 24 }}>
//     <OfferBanner />
//     <Categories
//       activeId={selectedCategoryId}
//       onPress={(id) => setSelectedCategoryId(id)}
//     />
//   </View>
// </View>
