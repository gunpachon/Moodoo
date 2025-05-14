import { IconSymbol } from "./IconSymbol";
import { useThemeColor } from "@/hooks/useThemeColor";

interface Props {
  size?: number;
  checked: boolean;
}

export function Checkbox({ size = 26, checked }: Props) {
  const tintColor = useThemeColor("tint");
  const uncheckedColor = useThemeColor("icon");

  return (
    <IconSymbol
      color={checked ? tintColor : uncheckedColor}
      size={size}
      name={checked ? "checkmark.circle.fill" : "circle"}
    />
  );
}
