import { AppText } from "@/components/common/text/app-text";
import { COLORS } from "@/lib/constants/color.constant";
import type { ICategory } from "@/lib/interfaces/home/categories.interface";
import { FlatList, Pressable, StyleSheet, View } from "react-native";

interface ButtonProps {
  id: string | null;
  name: string;
  onPress: (id: string | null) => void;
  activeId: string | null;
}

interface Props {
  activeId: string | null;
  onPress: (id: string | null) => void;
  categories: Pick<ICategory, "id" | "name">[];
}

export const Categories = ({ onPress, activeId, categories }: Props) => {
  const allCategories: { id: string | null; name: string }[] = [
    { id: null, name: "All Coffee" },
    ...categories,
  ];

  return (
    <View style={{ marginVertical: 18 }}>
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
