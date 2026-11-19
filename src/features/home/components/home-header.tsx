import { Bell, SearchIcon } from "@/components/common/icons/svg";
import Button from "@/components/ui/button";
import { AppTextInput } from "@/components/ui/input";
import { COLORS } from "@/lib/constants/color.constant";
import { StyleSheet, View } from "react-native";

export const HomeHeader = () => {
  return (
    <View style={styles.container}>
      <View style={[styles.topHeader, { marginTop: 12 }]}>
        <View style={{ flex: 1, minWidth: 0 }}>
          <View style={styles.icon}>
            <SearchIcon size={18} color={COLORS.BRWON.LIGHT_HOVER} />
          </View>
          <AppTextInput
            placeholder="Search coffee, roast, beans..."
            placeholderTextColor={COLORS.BRWON.LIGHT_HOVER}
            style={styles.searchInput}
          />
        </View>
        <Button
          size="small"
          style={{ width: 38, height: 38, borderRadius: 50 }}
          variant="ghost"
        >
          <Bell size={18} color={COLORS.SURFACE.WHITE} />
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingTop: 38,
    paddingBottom: 22,
    backgroundColor: COLORS.GREY.DARK,
    borderBottomStartRadius: 38,
    borderBottomEndRadius: 38,
  },
  location: {
    marginTop: 2,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  topHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 12,
  },
  icon: {
    position: "absolute",
    left: 12,
    top: "50%",
    zIndex: 1,
    transform: [{ translateY: "-50%" }],
  },
  searchInput: {
    paddingLeft: 38,
    width: "100%",
    backgroundColor: "transparent",
    borderColor: "#FFFFFF1A",
    borderRadius: 50,
    color: COLORS.BRWON.LIGHT_HOVER,
  },
});
