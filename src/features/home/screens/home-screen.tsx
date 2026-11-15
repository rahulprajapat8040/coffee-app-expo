import { View } from "react-native";
import { Categories } from "../components/categories";
import { HomeHeader } from "../components/home-header";
import { OfferBanner } from "../components/offer-banner";

export const HomeScreen = () => {
  return (
    <>
      <HomeHeader />
      <View style={{ paddingHorizontal: 24 }}>
        <OfferBanner />
        <Categories />
      </View>
    </>
  );
};
