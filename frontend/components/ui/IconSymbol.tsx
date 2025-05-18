// This file is a fallback for using MaterialIcons on Android and web.

import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { SymbolWeight } from "expo-symbols";
import { cssInterop } from "nativewind";
import React from "react";
import { OpaqueColorValue, StyleProp, View, ViewStyle } from "react-native";

// Add your SFSymbol to MaterialIcons mappings here.
const MAPPING = {
  // See MaterialIcons here: https://icons.expo.fyi
  // See SF Symbols in the SF Symbols app on Mac.
  "house.fill": "home",
  calendar: "calendar-month",
  "chart.bar.xaxis": "chart-box",
  "paperplane.fill": "send",
  "chevron.left.forwardslash.chevron.right": "code-tags",
  "chevron.right": "chevron-right",
  plus: "plus",
  checkmark: "check",
  circle: "checkbox-blank-circle-outline",
  "checkmark.circle.fill": "checkbox-marked-circle",
  "arrow.right": "arrow-right",
  "square.and.pencil": "pencil-plus",
  "arrowtriangle.left.circle.fill": "arrow-left-drop-circle",
  "arrowtriangle.right.circle.fill": "arrow-right-drop-circle",
  "chevron.down": "chevron-down",
  "person.fill": "account",
} as Partial<
  Record<
    import("expo-symbols").SymbolViewProps["name"],
    React.ComponentProps<typeof MaterialCommunityIcons>["name"]
  >
>;

export type IconSymbolName = keyof typeof MAPPING;

cssInterop(MaterialCommunityIcons, {
  className: {
    target: false,
    nativeStyleToProp: {
      width: "size",
      color: "color",
    },
  },
});

/**
 * An icon component that uses native SFSymbols on iOS, and MaterialIcons on Android and web. This ensures a consistent look across platforms, and optimal resource usage.
 *
 * Icon `name`s are based on SFSymbols and require manual mapping to MaterialIcons.
 */
export function IconSymbol({
  name,
  style,
  color,
  size,
  weight,
  className,
}: {
  name: IconSymbolName;
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
  weight?: SymbolWeight;
  className?: string;
}) {
  return (
    <View style={style} className={className}>
      <MaterialCommunityIcons
        size={size}
        color={color}
        className={className}
        name={MAPPING[name]}
      />
    </View>
  );
}
