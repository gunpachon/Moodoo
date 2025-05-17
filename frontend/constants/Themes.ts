import colors from "tailwindcss/colors";

import { DarkTheme, DefaultTheme, Theme } from "@react-navigation/native";

export const themes = {
  light: {
    "--color-primary": colors.teal[600],
    "--color-primary-content": colors.gray[100],
    "--color-secondary": colors.cyan[700],
    "--color-secondary-content": colors.gray[100],
    "--color-primary-soft": "#d7e7e4",
    "--color-base-100": colors.stone[200],
    "--color-base-200": colors.stone[100],
    "--color-base-content": colors.stone[900],
  },
  dark: {
    "--color-primary": colors.teal[500],
     "--color-primary-content": colors.gray[100],
     "--color-secondary": colors.cyan[700],
    "--color-secondary-content": colors.gray[100],
    "--color-primary-soft": "#1e2f2c",
    "--color-base-100": colors.stone[900],
    "--color-base-200": colors.stone[800],
    "--color-base-content": colors.stone[100],
  },
};

export const lightNavigationTheme = {
  ...DefaultTheme,
  colors: {
    background: themes.light["--color-base-100"],
    card: themes.light["--color-base-200"],
    text: themes.light["--color-base-content"],
    primary: themes.light["--color-primary"],
    border: DefaultTheme.colors.border,
    notification: DefaultTheme.colors.notification,
  },
} satisfies Theme;

export const darkNavigationTheme = {
  ...DarkTheme,
  colors: {
    background: themes.dark["--color-base-100"],
    card: themes.dark["--color-base-200"],
    text: themes.dark["--color-base-content"],
    primary: themes.dark["--color-primary"],
    border: DarkTheme.colors.border,
    notification: DarkTheme.colors.notification,
  },
} satisfies Theme;
