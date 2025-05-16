import { themes } from "@/constants/Themes";
import { useColorScheme } from "react-native";

export function useTheme() {
  const colorScheme = useColorScheme();

  return themes[colorScheme ?? "light"];
}
