import { Pressable, Text, View } from "react-native";

import { Button } from "@/components/ui/Button";
import { useEffect, useState } from "react";
import { PressableWithOpacity } from "@/components/PressableWithOpacity";
import { Checkbox } from "@/components/ui/Checkbox";
import { MoodFace } from "@/components/ui/MoodFace";
import { IconSymbol } from "@/components/ui/IconSymbol";

import { router } from "expo-router";
import { useDateFormat } from "@/hooks/useDateFormat";
import { MoodEntry, useMoodEntries } from "@/context/MoodEntriesContext";

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
    >
      <View className="flex-row gap-2 items-center">
        <Checkbox checked={checked} />
        <Text className="text-base-content">{challenge}</Text>
      </View>
    </PressableWithOpacity>
  );
}

interface Challenge {
  id: number;
  text: string;
  checked: boolean;
}

export default function HomeScreen() {
  const { moodEntries, fetchEntries } = useMoodEntries();

  const [todaysEntry, setTodaysEntry] = useState<MoodEntry | undefined>();
  const [challenges, setChallenges] = useState<Challenge[]>([
    { id: 1, text: "Exercise", checked: false },
    { id: 2, text: "Stay hydrated", checked: false },
  ]);

  const format = useDateFormat({
    dateStyle: "medium",
  });

  useEffect(() => {
    const now = new Date();

    fetchEntries(now.getFullYear(), now.getMonth() + 1)
      .then((entries) => {
        return entries.find(
          (e) =>
            e.date.getFullYear() === now.getFullYear() &&
            e.date.getMonth() === now.getMonth() &&
            e.date.getDate() === now.getDate(),
        );
      })
      .then((todaysEntry) => {
        if (todaysEntry) setTodaysEntry(todaysEntry);
      });
  }, [moodEntries]);

  const todayText = format.format(new Date());

  return (
    <View className="px-8 pt-[calc(env(safe-area-inset-top)+1rem)] pb-4 gap-4">
      <View className="mb-3">
        <Text className="text-base-content text-xl font-bold">
          What's up, Ideal!
        </Text>
      </View>
      <View>
        <Text className="text-base-content text-xl font-bold mb-2">
          Today's mood
        </Text>
        <View className="bg-base-200 rounded-md justify-center items-center h-28">
          {todaysEntry !== undefined ? (
            <Pressable className="opacity-100 active:opacity-70 p-6 pr-9 w-full h-full justify-center">
              <IconSymbol
                name="chevron.right"
                weight="semibold"
                className="absolute end-4 android:end-3 text-base-content opacity-50 size-4 android:size-5"
              />
              <View className="gap-4 w-full h-full flex-row items-center">
                <MoodFace mood={todaysEntry.value} size={52} />
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
                onPress={() => router.push("/record-mood")}
              ></Button>
            </View>
          )}
        </View>
      </View>
      <View className="pt-4">
        <Text className="text-base-content text-xl font-bold pb-2">
          Challenges
        </Text>
        <View className="bg-base-200 rounded-md justify-start items-stretch px-2 py-3 gap-1">
          {challenges.map((challenge, i) => (
            <ChallengeCheckbox
              challenge={challenge.text}
              checked={challenge.checked}
              onCheck={(checked) => {
                setChallenges(
                  challenges.map((c) => {
                    if (c.id == challenge.id) {
                      return { ...c, checked };
                    } else {
                      return c;
                    }
                  }),
                );
              }}
              key={challenge.id}
            />
          ))}

          <Button
            title="Add challenge"
            iconName="plus"
            className="px-3.5 py-2 gap-2.5"
            contentClassName="text-base-content opacity-70"
          ></Button>
        </View>
      </View>
    </View>
  );
}
