import { COLORS } from "@/lib/constants/color.constant";
import { homeApi } from "@/services/home.service";
import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { ActivityIndicator, Alert, FlatList, View } from "react-native";
import { Categories } from "../components/categories";
import { HomeHeader } from "../components/home-header";
import { OfferBanner } from "../components/offer-banner";
import { ProductCard } from "../components/product-card";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { orderApi } from "@/services/order.service";

export const HomeScreen = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const cartQuery = useQuery({
    queryKey: ["cart"],
    queryFn: orderApi.getMyCart,
  });
  const [pendingCartChanges, setPendingCartChanges] = useState<
    Record<string, number>
  >({});
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
  const refreshCart = () =>
    queryClient.invalidateQueries({ queryKey: ["cart"] });
  const markCartChange = useCallback((coffeeId: string, pending: boolean) => {
    setPendingCartChanges((current) => {
      const count = (current[coffeeId] ?? 0) + (pending ? 1 : -1);
      const next = { ...current };
      if (count > 0) {
        next[coffeeId] = count;
      } else {
        delete next[coffeeId];
      }
      return next;
    });
  }, []);
  const { mutate: addToCart } = useApiMutation(
    orderApi.addToCart,
    {
      onMutate: ({ coffeeId }) => markCartChange(coffeeId, true),
      onSuccess: refreshCart,
      onSettled: (_data, _error, { coffeeId }) =>
        markCartChange(coffeeId, false),
      onError: (error) =>
        Alert.alert("Couldn't add coffee to cart", error.message),
    },
  );
  const { mutate: updateQuantity } = useApiMutation(
    ({
      cartItemId,
      quantity,
      type,
    }: {
      cartItemId: string;
      quantity: number;
      type: "asc" | "desc";
      coffeeId: string;
    }) => orderApi.updateQuantity({ cartItemId, quantity, type }),
    {
      onMutate: ({ coffeeId }) => markCartChange(coffeeId, true),
      onSuccess: refreshCart,
      onSettled: (_data, _error, { coffeeId }) =>
        markCartChange(coffeeId, false),
      onError: (error) =>
        Alert.alert("Couldn't update cart", error.message),
    },
  );
  const { mutate: removeFromCart } = useApiMutation(
    ({ cartItemId }: { cartItemId: string; coffeeId: string }) =>
      orderApi.removeFromCart(cartItemId),
    {
      onMutate: ({ coffeeId }) => markCartChange(coffeeId, true),
      onSuccess: refreshCart,
      onSettled: (_data, _error, { coffeeId }) =>
        markCartChange(coffeeId, false),
      onError: (error) =>
        Alert.alert("Couldn't remove item", error.message),
    },
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
      renderItem={({ item }) => {
        const variant = item.variants.find(
          (option) => option.status === "AVAILABLE",
        );
        const cartItem = cartQuery.data?.data.find(
          (cartEntry) =>
            cartEntry.coffeeId === item.id &&
            cartEntry.variantId === variant?.id,
        );
        return (
          <ProductCard
            {...item}
            cartQuantity={cartItem?.quantity ?? 0}
            isCartUpdating={
              cartQuery.isLoading || Boolean(pendingCartChanges[item.id])
            }
            onAddToCart={() => {
              if (variant) {
                addToCart({
                  coffeeId: item.id,
                  variantId: variant.id,
                  quantity: 1,
                });
              }
            }}
            onDecreaseQuantity={() => {
              if (!cartItem) return;
              if (cartItem.quantity === 1) {
                removeFromCart({ cartItemId: cartItem.id, coffeeId: item.id });
                return;
              }
              updateQuantity({
                cartItemId: cartItem.id,
                quantity: 1,
                type: "desc",
                coffeeId: item.id,
              });
            }}
            onPress={() =>
              router.push({
                pathname: "/product/[id]",
                params: {
                  id: String(item.id),
                },
              })
            }
          />
        );
      }}
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
