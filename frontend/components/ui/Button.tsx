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
  title?: string;
  iconEnd?: boolean;
  textClassName?: string;
  iconClassName?: string;
  contentClassName?: string;
  disabled?: boolean;
}

export function Button({
  iconName,
  title,
  className,
  textClassName,
  iconClassName,
  contentClassName,
  iconEnd = false,
  disabled = false,
  onPress,
  ...rest
}: Props) {
  function Icon(iconName: IconSymbolName) {
    return (
      <IconSymbol
        name={iconName}
        className={twMerge(
          "text-primary size-5",
          contentClassName,
          iconClassName,
        )}
      />
    );
  }

  return (
    <Pressable
      className={twMerge(
        "flex-row items-center gap-1",
        !disabled && "active:opacity-50",
        className,
      )}
      onPress={disabled ? null : onPress}
      {...rest}
    >
      {!iconEnd && iconName && Icon(iconName)}
      {title !== undefined && (
        <Text
          className={twMerge(
            "text-primary font-semibold",
            contentClassName,
            textClassName,
            disabled && "text-base-content opacity-40",
          )}
        >
          {title}
        </Text>
      )}
      {iconEnd && iconName && Icon(iconName)}
    </Pressable>
  );
}
