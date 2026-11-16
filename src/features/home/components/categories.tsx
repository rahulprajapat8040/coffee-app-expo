import { AppText } from "@/components/common/text/app-text";
import { COLORS } from "@/lib/constants/color.constant";
import { QUERY_CONSTANT } from "@/lib/constants/query.constant";
import { homeApi } from "@/services/home.service";
import { useSuspenseQuery } from "@tanstack/react-query";
import { FlatList, Pressable, StyleSheet, View } from "react-native";

interface ButtonProps {
  id: string | null;
  name: string;
  onPress: (id: string | null) => void;
  activeId: string | null;
}

interface Category {
  id: string | null;
  name: string;
}

interface Props {
  activeId: string | null;
  onPress: (id: string | null) => void;
}

export const Categories = ({ onPress, activeId }: Props) => {
  const {
    data: {
      data: { data: categories },
    },
  } = useSuspenseQuery({
    queryFn: () => homeApi.getCategories(),
    queryKey: [QUERY_CONSTANT.CATEGORY, QUERY_CONSTANT.LIST],
  });

  const allCategories: Category[] = [
    { id: null, name: "All Coffee" },
    ...categories,
  ];

  return (
    <View style={{ marginBottom: 18 }}>
      <FlatList
        data={allCategories}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id || ""}
        renderItem={({ item }) => (
          <CategoryButton
            id={item.id}
            name={item.name}
            onPress={(id) => onPress(id)}
            activeId={activeId}
          />
        )}
      />
    </View>
  );
};

const CategoryButton = ({ id, name, onPress, activeId }: ButtonProps) => {
  const isActive = id === activeId;
  return (
    <Pressable onPress={() => onPress(id)}>
      <AppText style={[styles.category, isActive && styles.activeCategory]}>
        {name}
      </AppText>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  category: {
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    marginRight: 20,
    backgroundColor: "#EDEDED",
  },
  activeCategory: {
    backgroundColor: COLORS.BRWON.NORMAL,
    color: COLORS.SURFACE.WHITE,
    fontWeight: "bold",
  },
});
