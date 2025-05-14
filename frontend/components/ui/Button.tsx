import {
  Text,
  Pressable,
  ViewStyle,
  StyleProp,
  PressableProps,
} from "react-native";
import { IconSymbol, type IconSymbolName } from "./IconSymbol";
import { ColorName, useThemeColor } from "@/hooks/useThemeColor";

interface Props extends PressableProps {
  iconName?: IconSymbolName;
  title: string;
  style?: StyleProp<ViewStyle>;
  iconEnd?: boolean;
  colorName?: ColorName;
}

export function Button({
  iconName,
  title,
  style,
  iconEnd = false,
  colorName = "tint",
  ...rest
}: Props) {
  const tintColor = useThemeColor(colorName);

  function Icon(iconName: IconSymbolName) {
    return <IconSymbol name={iconName} color={tintColor} size={20} />;
  }

  return (
    <Pressable
      style={({ pressed }) => [
        {
          opacity: pressed ? 0.5 : 1,
        },
        {
          flexDirection: "row",
          alignItems: "center",
          gap: 4,
        },
        style,
      ]}
      {...rest}
    >
      {!iconEnd && iconName && Icon(iconName)}
      <Text
        style={{
          color: tintColor,
          fontWeight: "600",
          fontSize: 16,
        }}
      >
        {title}
      </Text>
      {iconEnd && iconName && Icon(iconName)}
    </Pressable>
  );
}
