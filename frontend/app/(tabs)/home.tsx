import { Alert, Modal, Pressable, Text, View } from "react-native";

import { Button } from "@/components/ui/Button";
import { useCallback, useEffect, useState } from "react";
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
import { useAuth } from "@/context/AuthContext";

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

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

interface ApiResponseUserProfile {
  created_at: string;
  id: number;
  nickname: string;
  streak: number;
  username: string;
}

export default function HomeScreen() {
  const { entriesCache, fetchEntries, getLoadedEntries } = useMoodEntries();

  const { token, setToken } = useAuth();

  const [todaysEntry, setTodaysEntry] = useState<MoodEntry | undefined>();
  const { challenges, setDone } = useChallenges();

  const format = useDateFormat({
    dateStyle: "medium",
  });

  const today = new Date();

  useEffect(() => {
    const year = today.getFullYear();
    const monthNumber = today.getMonth() + 1;
    const entries = getLoadedEntries(year, monthNumber);

    if (entries === undefined) {
      fetchEntries(year, monthNumber);
    } else {
      const todaysEntry = entries.find((e) => sameDay(e.date, today));
      setTodaysEntry(todaysEntry);
    }
  }, [entriesCache]);

  const todayText = format.format(today);

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [name, setName] = useState<string | undefined>(undefined);
  const [streak, setStreak] = useState<number | undefined>(undefined);

  const fetchName = useCallback(async () => {
    const response = await fetch(`${BASE_URL}/api/get_user`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Include the JWT token
      },
    });

    if (response.ok) {
      const apiResponse = (await response.json()) as ApiResponseUserProfile;

      setName(apiResponse.nickname);
      setStreak(apiResponse.streak);
    } else {
      console.error("Failed to update name");
    }
  }, [token]);

  useEffect(() => {
    fetchName();
  }, [token]);

  const changeName = useCallback(
    async (newName: string) => {
      const response = await fetch(`${BASE_URL}/api/update_user`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include the JWT token
        },
        body: JSON.stringify({
          nickname: newName,
        }),
      });

      if (response.ok) {
        fetchName();
      } else {
        console.error("Failed to update name");
      }
    },
    [token],
  );

  return (
    <View className="px-8 pt-[calc(env(safe-area-inset-top)+1rem)] pb-4 gap-4">
      <View className="relative mb-3 justify-between flex-row items-center">
        <Text className="text-base-content text-2xl font-bold">
          What's up, {name}!
        </Text>
        <Button
          iconName="person.fill"
          contentClassName="text-base-content"
          className="p-2"
          iconClassName="size-6"
          onPress={() => setDropdownOpen((o) => !o)}
        ></Button>
        {dropdownOpen && (
          <View className="absolute right-0 top-12 w-40 bg-base-200 rounded-lg py-1 z-50 border border-base-content-soft shadow shadow-black/15">
            <Button
              title="Change name"
              className="px-4 py-3"
              contentClassName="text-base-content"
              onPress={() => {
                Alert.prompt("Change name", "Enter a new name", (newName) => {
                  changeName(newName);
                });
                setDropdownOpen(false);
              }}
            />
            <Button
              title="Log out"
              className="px-4 py-3"
              contentClassName="text-red-500"
              onPress={() => {
                setToken(null);
                if (router.canDismiss()) router.dismissAll();
                router.replace("/");
              }}
            />
          </View>
        )}
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
          {challenges.map((challenge) => (
            <ChallengeCheckbox
              challenge={challenge.name}
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
