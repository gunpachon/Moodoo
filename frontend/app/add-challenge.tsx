import { PressableWithOpacity } from "@/components/PressableWithOpacity";
import { Button } from "@/components/ui/Button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useChallenges } from "@/context/ChallengesContext";
import { useTheme } from "@/hooks/useTheme";
import { router } from "expo-router";
import { vars } from "nativewind";
import { Alert, ScrollView, Text, View } from "react-native";

const suggestions = [
  null,
  "Meditate",
  "Exercise",
  "Wake up early",
  "Read books",
  "Eat healthy",
  "Listen to podcast",
  "Write journal",
];

export default function addChallenge() {
  const theme = useTheme();

  const { addChallenge } = useChallenges();

  return (
    <ScrollView className="p-6" style={vars(theme)}>
      <View className="mb-4">
        <Text className="text-base-content text-2xl font-bold">
          Choose from our suggestions
        </Text>
        <Text className="text-base-content text-lg leading-tight">
          Or write your own!
        </Text>
      </View>
      <View style={vars(theme)} className="gap-4">
        {[...new Array(Math.ceil(suggestions.length / 2))].map((_, i) => (
          <View className="flex-row gap-4" key={i}>
            {[0, 1].map((_, j) => {
              const suggestion = suggestions[i * 2 + j];
              const isCustom = suggestion === null;

              return (
                <PressableWithOpacity
                  className="bg-base-200 border border-base-content-soft h-40 basis-0 grow gap-4 rounded-lg items-start justify-between py-2.5 px-3.5"
                  key={j}
                  onPress={() => {
                    let challengeText: Promise<string>;
                    if (isCustom) {
                      challengeText = new Promise((res) =>
                        Alert.prompt(
                          "Custom challenge",
                          "Write your own challenge",
                          res,
                        ),
                      );
                    } else {
                      challengeText = Promise.resolve(suggestion);
                    }

                    challengeText.then((text) => {
                      addChallenge(text, isCustom);
                      router.dismiss();
                    });
                  }}
                >
                  <IconSymbol
                    name={isCustom ? "pencil.line" : "plus"}
                    className="text-base-content mt-2 size-7"
                  ></IconSymbol>
                  {isCustom ? (
                    <Text className="text-base-content font-semibold text-lg">
                      Custom…
                    </Text>
                  ) : (
                    <Text className="text-base-content font-semibold text-lg">
                      {suggestions[i * 2 + j]}
                    </Text>
                  )}
                </PressableWithOpacity>
              );
            })}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
