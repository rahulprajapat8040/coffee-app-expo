import { StyleSheet, Text } from "react-native";

interface Props {
  label: string;
  style?: object;
}

export const Label = ({ label, style }: Props) => {
  return <Text style={[styles.label, style]}>{label}</Text>;
};

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#222',
    marginBottom: 8,
  },
});