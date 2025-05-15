import { Text, type TextProps, StyleSheet } from "react-native";

import { twMerge } from "tailwind-merge";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: "default" | "title" | "defaultSemiBold" | "subtitle" | "link";
};

const classes = {
  default: "text-base leading-6",
  defaultSemiBold: "text-base leading-6 font-semibold",
  title: "text-2xl font-bold leading-8",
  subtitle: "text-xl font-bold",
  link: "leading-[30px] text-base text-[#0a7ea4]",
};

export function ThemedText({
  className,
  type = "default",
  ...rest
}: ThemedTextProps) {
  return (
    <Text
      className={twMerge(
        "text-base-content",
        type === "default" ? classes.default : undefined,
        type === "title" ? classes.title : undefined,
        type === "defaultSemiBold" ? classes.defaultSemiBold : undefined,
        type === "subtitle" ? classes.subtitle : undefined,
        type === "link" ? classes.link : undefined,
        className,
      )}
      {...rest}
    />
  );
}
