import { Alert, Text, View } from "react-native";
import * as Haptics from "expo-haptics";
import { PressableWithOpacity } from "../PressableWithOpacity";
import { Checkbox } from "./Checkbox";
import { useChallenges } from "@/context/ChallengesContext";
import { router } from "expo-router";
import { Button } from "./Button";
import { twMerge } from "tailwind-merge";

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
      className="px-3 py-2.5 grow"
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

export default function Challenges({
  showAdd,
  showDelete = false,
}: {
  showAdd: boolean;
  showDelete?: boolean;
}) {
  const { challenges, setDone, deleteChallenge } = useChallenges();

  const isLoading = challenges === undefined;

  return (
    <View className="px-2 py-3 gap-1">
      {isLoading ? (
        <View className="h-10 items-center justify-center">
          <Text className="text-base-content opacity-50">Loading…</Text>
        </View>
      ) : challenges.length === 0 ? (
        <View className="h-10 items-center justify-center">
          <Text className="text-base-content opacity-50">
            There were no challenges on that day
          </Text>
        </View>
      ) : (
        <>
          {challenges.map((challenge) => (
            <View className="flex-row items-center" key={challenge.id}>
              <ChallengeCheckbox
                challenge={challenge.name}
                checked={challenge.completed}
                onCheck={(checked) => {
                  setDone(challenge, checked);
                }}
              />
              {showDelete && (
                <Button
                  iconName="trash.fill"
                  className="px-3"
                  contentClassName="text-red-500"
                  iconClassName="size-6"
                  onPress={() => {
                    Alert.alert(
                      "Delete challenge?",
                      `Are you sure you want to delete "${challenge.name}"?`,
                      [
                        {
                          text: "Cancel",
                          style: "cancel",
                        },
                        {
                          text: "Delete",
                          style: "destructive",
                          onPress: () => {
                            deleteChallenge(challenge);
                          },
                        },
                      ],
                    );
                  }}
                />
              )}
            </View>
          ))}
          {showAdd && (
            <Button
              title="Add challenge"
              iconName="plus"
              className="px-3.5 py-2 gap-2.5"
              contentClassName="text-base-content opacity-70"
              onPress={() => router.push("/add-challenge")}
            ></Button>
          )}
        </>
      )}
    </View>
  );
}
