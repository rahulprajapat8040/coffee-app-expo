import { SafeAreaView } from "react-native-safe-area-context";
import { LoginForm } from "../components/login/login-form";
import { LoginHeader } from "../components/login/login-header";

export const Login = () => {
  return (
    <SafeAreaView style={{ paddingHorizontal: 24, flex: 1 }}>
      <LoginHeader />
      <LoginForm />
    </SafeAreaView>
  );
};
