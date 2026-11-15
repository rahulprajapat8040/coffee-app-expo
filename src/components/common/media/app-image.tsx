import { API_BASE_URL } from '@/lib/constants/routes.constant';
import { Image } from 'react-native';

interface Props {
  src: string;
  style?: object;
}

export const AppImage = ({ src, style }: Props) => {
  return <Image style={style} src={`${API_BASE_URL}/${src}`} />;
};
