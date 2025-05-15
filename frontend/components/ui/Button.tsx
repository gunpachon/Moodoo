import {
  Text,
  Pressable,
  ViewStyle,
  StyleProp,
  PressableProps,
} from "react-native";
import { IconSymbol, type IconSymbolName } from "./IconSymbol";
import { twMerge } from "tailwind-merge";

interface Props extends PressableProps {
  iconName?: IconSymbolName;
  title: string;
  iconEnd?: boolean;
  contentClassName?: string;
}

export function Button({
  iconName,
  title,
  className,
  contentClassName,
  iconEnd = false,
  ...rest
}: Props) {
  function Icon(iconName: IconSymbolName) {
    return (
      <IconSymbol
        name={iconName}
        className={twMerge("text-primary size-5", contentClassName)}
      />
    );
  }

  return (
    <Pressable
      className={twMerge(
        "active:opacity-50 flex-row items-center gap-1",
        className,
      )}
      {...rest}
    >
      {!iconEnd && iconName && Icon(iconName)}
      <Text className={twMerge("text-primary font-semibold", contentClassName)}>
        {title}
      </Text>
      {iconEnd && iconName && Icon(iconName)}
    </Pressable>
  );
}
