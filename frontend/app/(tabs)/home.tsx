import { Alert, Pressable, Text, View } from "react-native";

import { Button } from "@/components/ui/Button";
import { useCallback, useEffect, useState } from "react";
import { MoodFace } from "@/components/ui/MoodFace";
import { IconSymbol } from "@/components/ui/IconSymbol";

import { router } from "expo-router";
import { useDateFormat } from "@/hooks/useDateFormat";
import { MoodEntry, useMoodEntries } from "@/context/MoodEntriesContext";
import { getDateURLParam, sameDay } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import Challenges from "@/components/ui/Challenges";

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

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
        <View className="flex-row items-center gap-2">
          <View className="flex-row items-center bg-base-200 px-3 py-0.5 rounded-full border border-base-content-soft">
            <Text className="text-base-content text-xl font-medium mx-1">
              {streak}
            </Text>
            <IconSymbol name="flame.fill" className="size-5 text-red-400" />
          </View>
          <Button
            iconName="person.fill"
            contentClassName="text-base-content"
            className="p-2 bg-base-200 rounded-full border border-base-content-soft"
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
        <View className="bg-base-200 rounded-md justify-start items-stretch">
          <Challenges showAdd={true} />
        </View>
      </View>
    </View>
  );
}
