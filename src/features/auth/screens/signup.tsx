import { SafeAreaView } from "react-native-safe-area-context";
import { SignupForm } from "../components/signup/signup-form";
import { SignupHeader } from "../components/signup/signup-header";

export const Signup = () => {
  return (
    <SafeAreaView style={{ paddingHorizontal: 24, flex: 1 }}>
      <SignupHeader />
      <SignupForm />
    </SafeAreaView>
  );
};
