import { Pressable, Text, View } from "react-native";

import { Button } from "@/components/ui/Button";
import { useEffect, useState } from "react";
import { PressableWithOpacity } from "@/components/PressableWithOpacity";
import { Checkbox } from "@/components/ui/Checkbox";
import { MoodFace } from "@/components/ui/MoodFace";
import { IconSymbol } from "@/components/ui/IconSymbol";

import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { useDateFormat } from "@/hooks/useDateFormat";
import { MoodEntry, useMoodEntries } from "@/context/MoodEntriesContext";
import { useChallenges } from "@/context/ChallengesContext";
import { getDateURLParam, sameDay } from "@/lib/utils";

function ChallengeCheckbox({
  challenge,
  checked,
  onCheck,
}: {
  challenge: string;
  checked: boolean;
  onCheck: (checked: boolean) => void;
}) {
  return (
    <PressableWithOpacity
      className="px-3 py-2.5"
      onPress={() => {
        onCheck(!checked);
      }}
      onPressIn={() => {
        if (process.env.EXPO_OS === "ios") {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
      }}
    >
      <View className="flex-row gap-2 items-center">
        <Checkbox checked={checked} />
        <Text className="text-base-content">{challenge}</Text>
      </View>
    </PressableWithOpacity>
  );
}

export default function HomeScreen() {
  const { moodEntries, fetchEntries } = useMoodEntries();

  const [todaysEntry, setTodaysEntry] = useState<MoodEntry | undefined>();
  const { challenges, setDone } = useChallenges();

  const format = useDateFormat({
    dateStyle: "medium",
  });

  const today = new Date();

  useEffect(() => {
    fetchEntries(today.getFullYear(), today.getMonth() + 1)
      .then((entries) => {
        return entries.find((e) => sameDay(e.date, today));
      })
      .then((todaysEntry) => {
        if (todaysEntry) setTodaysEntry(todaysEntry);
      });
  }, [moodEntries]);

  const todayText = format.format(today);

  return (
    <View className="px-8 pt-[calc(env(safe-area-inset-top)+1rem)] pb-4 gap-4">
      <View className="mb-3">
        <Text className="text-base-content text-2xl font-bold">
          What's up, Ideal!
        </Text>
      </View>
      <View>
        <Text className="text-base-content text-2xl font-bold mb-2">
          Today's mood
        </Text>
        <View className="bg-base-200 rounded-md justify-center items-center h-28">
          {todaysEntry !== undefined ? (
            <Pressable
              className="opacity-100 active:opacity-70 p-6 pr-9 w-full h-full justify-center"
              onPress={() =>
                router.push(`/edit-mood?dateToEdit=${getDateURLParam(today)}`)
              }
            >
              <IconSymbol
                name="chevron.right"
                weight="semibold"
                className="absolute end-4 android:end-3 text-base-content opacity-50 size-4 android:size-5"
              />
              <View className="gap-4 w-full h-full flex-row items-center">
                <MoodFace mood={todaysEntry.value} />
                <View className="shrink items-start">
                  <Text className="text-base-content text-lg font-bold">
                    {todayText}
                  </Text>
                  <Text className="text-base-content font-medium">
                    {todaysEntry.feelings.join(", ")}
                  </Text>
                </View>
              </View>
            </Pressable>
          ) : (
            <View className="items-center justify-center">
              <Text className="text-base-content text-lg">
                Not recorded yet
              </Text>
              <Button
                title="Record mood"
                iconName="square.and.pencil"
                className="p-2"
                onPress={() => router.push("/edit-mood?adding=true")}
              ></Button>
            </View>
          )}
        </View>
      </View>
      <View className="pt-4">
        <Text className="text-base-content text-2xl font-bold pb-2">
          Challenges
        </Text>
        <View className="bg-base-200 rounded-md justify-start items-stretch px-2 py-3 gap-1">
          {challenges.map((challenge, i) => (
            <ChallengeCheckbox
              challenge={challenge.text}
              checked={challenge.completed}
              onCheck={(checked) => {
                setDone(challenge, checked);
              }}
              key={challenge.id}
            />
          ))}

          <Button
            title="Add challenge"
            iconName="plus"
            className="px-3.5 py-2 gap-2.5"
            contentClassName="text-base-content opacity-70"
            onPress={() => router.push("/add-challenge")}
          ></Button>
        </View>
      </View>
    </View>
  );
}
