import { COLORS } from '@/lib/constants/color.constant';
import { FONT_SIZES, FONTS } from '@/lib/constants/font.constant';
import { Text, TextProps } from 'react-native';

interface Props extends TextProps {
  weight?: string;
  size?: number;
  color?: string;
  align?: 'left' | 'right' | 'center';
}

export const AppText = ({
  style,
  weight = FONTS.regular,
  size = FONT_SIZES.base,
  color = COLORS.GREY.NORMAL,
  align = 'left',
  ...props
}: Props) => {
  return (
    <Text
      style={[
        { fontFamily: weight, fontSize: size, color, textAlign: align },
        style,
      ]}
      {...props}
    />
  );
};
