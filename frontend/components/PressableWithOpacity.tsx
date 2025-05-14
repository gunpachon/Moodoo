import { Pressable, type PressableProps } from "react-native";

export function PressableWithOpacity({
  style: originalStyle,
  ...rest
}: PressableProps) {
  return (
    <Pressable
      style={(state) => [
        {
          opacity: state.pressed ? 0.6 : 1,
        },
        typeof originalStyle === "function"
          ? originalStyle(state)
          : originalStyle,
      ]}
      {...rest}
    />
  );
}
