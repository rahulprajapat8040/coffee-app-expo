import { MainStackParamList } from '@/app/navigation/main-navigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type CheckoutNavigationProp = NativeStackNavigationProp<
  MainStackParamList,
  'Checkout'
>;

export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
};
