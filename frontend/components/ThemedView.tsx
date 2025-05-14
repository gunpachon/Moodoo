import { View, type ViewProps } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";
import { Colors } from "@/constants/Colors";

export type ThemedViewProps = ViewProps & {
  backgroundColor?: keyof typeof Colors.light & keyof typeof Colors.dark;
};

export function ThemedView({
  style,
  backgroundColor,
  ...otherProps
}: ThemedViewProps) {
  const themeAwareBgColor = backgroundColor
    ? useThemeColor(backgroundColor)
    : undefined;

  return (
    <View
      style={[{ backgroundColor: themeAwareBgColor }, style]}
      {...otherProps}
    />
  );
}
