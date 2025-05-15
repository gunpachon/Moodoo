import { SymbolView, SymbolViewProps, SymbolWeight } from "expo-symbols";
import { cssInterop } from "nativewind";

cssInterop(SymbolView, {
  className: {
    target: "style",
    nativeStyleToProp: {
      color: "tintColor",
      width: "size",
    },
  },
});

export function IconSymbol({
  name,
  color,
  className,
  weight = "regular",
}: {
  name: SymbolViewProps["name"];
  size?: number;
  color?: string;
  weight?: SymbolWeight;
  className?: string;
}) {
  return (
    <SymbolView
      weight={weight}
      tintColor={color}
      resizeMode="scaleAspectFit"
      name={name}
      className={className}
    />
  );
}
