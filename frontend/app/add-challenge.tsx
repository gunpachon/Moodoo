import { PressableWithOpacity } from "@/components/PressableWithOpacity";
import { Button } from "@/components/ui/Button";
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
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-3xl font-bold">Add a challenge</Text>
        <Button
          title="Cancel"
          contentClassName="text-primary text-xl"
          onPress={() => router.dismiss()}
        ></Button>
      </View>
      <View style={vars(theme)} className="gap-4">
        {[...new Array(Math.ceil(suggestions.length / 2))].map((_, i) => (
          <View className="flex-row gap-4" key={i}>
            {[0, 1].map((_, j) => {
              const suggestion = suggestions[i * 2 + j];
              const isCustom = suggestion === null;

              return (
                <PressableWithOpacity
                  className="bg-base-200 h-40 basis-0 grow gap-4 rounded-lg items-start justify-end py-2 px-3"
                  key={j}
                  onPress={() => {
                    let challengeText: Promise<string>;
                    if (isCustom) {
                      challengeText = new Promise((res) =>
                        Alert.prompt("Custom…", undefined, res),
                      );
                    } else {
                      challengeText = Promise.resolve(suggestion);
                    }

                    challengeText.then((text) => {
                      addChallenge(text, false);
                      router.dismiss();
                    });
                  }}
                >
                  {isCustom ? (
                    <Text className="font-semibold text-lg">Custom…</Text>
                  ) : (
                    <Text className="font-semibold text-lg">
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
