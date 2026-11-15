import { TextInput, TextInputProps, View } from "react-native";

import { StyleSheet } from "react-native";

export const AppTextInput = ({ style, ...textInputProps }: TextInputProps) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.input, style]}
        placeholderTextColor="#999"
        showSoftInputOnFocus={true}
        {...textInputProps}
      />
    </View>
  );
};

export const styles = StyleSheet.create({
  container: {
    width: "100%",
  },

  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    paddingHorizontal: 14,
    fontSize: 15,
    color: "#222",
    backgroundColor: "#FFF",
  },
});
