import { PressableWithOpacity } from "@/components/PressableWithOpacity";
import { Button } from "@/components/ui/Button";
import { MoodFace, MoodNumber } from "@/components/ui/MoodFace";
import { useMoodEntries } from "@/context/MoodEntriesContext";
import { useDateFormat } from "@/hooks/useDateFormat";
import { useTheme } from "@/hooks/useTheme";
import { router, Stack } from "expo-router";
import { vars } from "nativewind";
import { useState } from "react";
import { PressableProps, Text, TextInput, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { twMerge } from "tailwind-merge";

interface MoodFaceRadioProps extends PressableProps {
  mood: MoodNumber;
  isSelected: boolean;
}

interface ChipProps extends PressableProps {
  text: string;
  isSelected: boolean;
}

const moodValueNames = {
  1: "Unpleasant",
  2: "Slightly unpleasant",
  3: "Neutral",
  4: "Slightly pleasant",
  5: "Pleasant",
} as const;

const feelingDescriptions = {
  neutral: ["Content", "Calm", "Peaceful", "Indifferent", "Drained", "Relaxed"],
  good: [
    "Relaxed",
    "Proud",
    "Excited",
    "Confident",
    "Peaceful",
    "Satisfied",
    "Passionate",
    "Grateful",
    "Relieved",
  ],
  bad: [
    "Lonely",
    "Stressed",
    "Anxious",
    "Scared",
    "Hopeless",
    "Disappointed",
    "Angry",
    "Embarrassed",
  ],
};

const impactList = [
  "Hobbies",
  "Health",
  "Fitness",
  "Spirituality",
  "Family",
  "Friends",
  "Partner",
  "Dating",
  "Work",
  "Travel",
  "Education",
  "Weather",
  "Money",
];

const MoodFaceRadio = ({ mood, isSelected, ...rest }: MoodFaceRadioProps) => {
  return (
    <PressableWithOpacity {...rest}>
      <MoodFace
        mood={mood}
        className={twMerge("size-14")}
        iconClassName={twMerge(
          !isSelected && "text-base-content opacity-10 dark:opacity-25",
        )}
      />
    </PressableWithOpacity>
  );
};

const Chip = ({ text, isSelected, ...rest }: ChipProps) => {
  return (
    <PressableWithOpacity
      className={twMerge(
        "px-4 py-2 bg-base-200 rounded-xl flex-row items-center gap-1 border border-transparent",
        isSelected && "bg-primary-soft border-primary",
      )}
      {...rest}
    >
      <Text
        className={twMerge(
          "text-base-content text-lg font-medium",
          isSelected && "text-primary",
        )}
      >
        {text}
      </Text>
    </PressableWithOpacity>
  );
};

export default function AddChallenge() {
  const theme = useTheme();

  const [mood, setMood] = useState<MoodNumber | undefined>(undefined);
  const [feelings, setFeelings] = useState<Set<string>>(new Set());
  const [impacts, setImpacts] = useState<Set<string>>(new Set());
  const [notes, setNotes] = useState<string>();

  const canSave = mood !== undefined && feelings.size > 0 && impacts.size > 0;

  const dateFormat = useDateFormat({
    dateStyle: "medium",
  });

  const { addEntry } = useMoodEntries();

  function saveMood() {
    if (!canSave) return;

    addEntry({
      date: new Date(),
      feelings: Array.from(feelings),
      impacts: Array.from(impacts),
      value: mood,
      notes: notes?.trim() || undefined,
    });
  }

  return (
    <KeyboardAwareScrollView contentContainerClassName="justify-end pb-[env(safe-area-inset-bottom)]">
      <View className="p-6 gap-2" style={vars(theme)}>
        <Stack.Screen
          options={{
            headerRight: () => {
              return (
                <Button
                  title="Save"
                  style={vars(theme)}
                  contentClassName="text-lg"
                  disabled={!canSave}
                  onPress={() => {
                    saveMood();
                    router.dismiss();
                  }}
                ></Button>
              );
            },
          }}
        ></Stack.Screen>
        <View className="mb-2">
          <Text className="text-base-content text-lg font-medium leading-snug">
            {dateFormat.format(new Date())}
          </Text>
          <Text className="text-base-content text-2xl font-bold">
            How was today?
          </Text>
        </View>
        <View className="bg-base-200 p-6 rounded-lg gap-4 items-center">
          <View className="flex-row items-center justify-evenly gap-6 w-full">
            {([1, 2, 3, 4, 5] as const).map((i) => (
              <MoodFaceRadio
                mood={i}
                isSelected={i === mood}
                key={i}
                onPress={() => setMood(i)}
                className="shrink"
              />
            ))}
          </View>
        </View>
        <Text className="text-base-content font-medium self-end">
          {mood !== undefined ? moodValueNames[mood] : ""}
        </Text>
        <Text className="text-base-content mt-1 mb-2 text-2xl font-bold">
          Describe your feeling
        </Text>
        <View className="flex-row flex-wrap gap-2">
          {feelingDescriptions.good.map((text, i) => (
            <Chip
              text={text}
              isSelected={feelings.has(text)}
              key={i}
              onPress={() => {
                setFeelings((feelings) => {
                  if (feelings.has(text)) {
                    const filteredList = [...feelings].filter(
                      (t) => t !== text,
                    );
                    return new Set(filteredList);
                  } else {
                    return new Set([...feelings, text]);
                  }
                });
              }}
            />
          ))}
        </View>
        <Text className="mt-6 text-base-content mb-2 text-2xl font-bold">
          Most impactful today
        </Text>
        <View className="flex-row flex-wrap gap-2">
          {impactList.map((text, i) => (
            <Chip
              text={text}
              isSelected={impacts.has(text)}
              key={i}
              onPress={() => {
                setImpacts((impacts) => {
                  if (impacts.has(text)) {
                    const filteredList = [...impacts].filter((t) => t !== text);
                    return new Set(filteredList);
                  } else {
                    return new Set([...impacts, text]);
                  }
                });
              }}
            />
          ))}
        </View>
        <Text className="text-base-content text-2xl font-bold mt-6 mb-2">
          Notes
        </Text>
        <TextInput
          placeholder="Optional notes"
          className="w-full bg-base-200 text-base-content px-5 py-3 rounded-lg h-48 text-lg"
          multiline={true}
          value={notes}
          onChangeText={setNotes}
        ></TextInput>
      </View>
    </KeyboardAwareScrollView>
  );
}
