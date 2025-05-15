import colors from "tailwindcss/colors";

export const themes = {
  light: {
    "--color-primary": colors.teal[600],
    "--color-base-100": colors.stone[200],
    "--color-base-200": colors.stone[100],
    "--color-base-content": colors.stone[900],
  },
  dark: {
    "--color-primary": colors.teal[500],
    "--color-base-100": colors.stone[900],
    "--color-base-200": colors.stone[800],
    "--color-base-content": colors.stone[100],
  },
};
