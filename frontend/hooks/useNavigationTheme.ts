import { darkNavigationTheme, lightNavigationTheme } from "@/constants/Themes";
import { useColorScheme } from "./useColorScheme";

export function useNavigationTheme() {
  const colorScheme = useColorScheme();
  const navigationTheme =
    colorScheme === "dark" ? darkNavigationTheme : lightNavigationTheme;

  return navigationTheme;
}
