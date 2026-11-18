import { AppText } from "@/components/common/text/app-text";

interface FormErrorProps {
  message?: string;
}

export const FormError = ({ message }: FormErrorProps) => {
  if (!message) return null;

  return (
    <AppText size={12} color={"#DC2626"} style={{ marginTop: 4 }}>
      {message}
    </AppText>
  );
};
