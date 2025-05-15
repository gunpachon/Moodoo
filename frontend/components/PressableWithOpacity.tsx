import { Pressable, type PressableProps } from "react-native";
import { twMerge } from "tailwind-merge";

export function PressableWithOpacity({
  style,
  className,
  ...rest
}: PressableProps) {
  return (
    <Pressable
      style={style}
      className={twMerge("active:opacity-60", className)}
      {...rest}
    />
  );
}
