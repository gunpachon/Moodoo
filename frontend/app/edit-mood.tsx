import { PressableWithOpacity } from "@/components/PressableWithOpacity";
import { Button } from "@/components/ui/Button";
import { MoodFace, MoodNumber } from "@/components/ui/MoodFace";
import { useMoodEntries } from "@/context/MoodEntriesContext";
import { useDateFormat } from "@/hooks/useDateFormat";
import { useTheme } from "@/hooks/useTheme";
import { sameDay } from "@/lib/utils";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { vars } from "nativewind";
import { useEffect, useState } from "react";
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

export default function RecordMood() {
  const { dateToEdit, adding } = useLocalSearchParams<{
    dateToEdit?: string;
    adding?: string;
  }>();
  const { getLoadedEntries, fetchEntries } = useMoodEntries();

  const isAdding = adding !== undefined || dateToEdit === undefined;

  const [isLoading, setLoading] = useState(false);

  const theme = useTheme();

  let storedMood = undefined;
  let storedFeelings = new Set<string>();
  let storedImpacts = new Set<string>();
  let storedNotes = undefined;

  let editingID = null;
  let editingDate = new Date();

  if (dateToEdit) {
    const tokens = dateToEdit.split("-");
    if (tokens.length !== 3) throw new Error("Invalid parameter");
    let [year, month, day] = tokens;

    const yearNumber = parseInt(year);
    const monthNumber = parseInt(month);
    const dayNumber = parseInt(day);

    if (isNaN(yearNumber) || isNaN(monthNumber) || isNaN(dayNumber))
      throw new Error("Invalid parameter");

    editingDate = new Date(yearNumber, monthNumber - 1, dayNumber);

    const entries = getLoadedEntries(
      editingDate.getFullYear(),
      editingDate.getMonth() + 1,
    );

    if (entries) {
      const entry = entries.find(
        (entry) => entry.date.getDate() === editingDate.getDate(),
      );

      if (entry) {
        editingID = entry.id;
        storedMood = entry.value;
        storedFeelings = new Set(entry.feelings);
        storedImpacts = new Set(entry.impacts);
        storedNotes = entry.notes;
      }
    } else {
      setLoading(true);
      fetchEntries(editingDate.getFullYear(), editingDate.getMonth() + 1).then(
        () => {
          setLoading(false);
        },
      );
    }
  }

  const [mood, setMood] = useState<MoodNumber | undefined>(storedMood);
  const [feelings, setFeelings] = useState<Set<string>>(storedFeelings);
  const [impacts, setImpacts] = useState<Set<string>>(storedImpacts);
  const [notes, setNotes] = useState<string | undefined>(storedNotes);

  const isToday = sameDay(editingDate, new Date());

  const canSave = mood !== undefined && feelings.size > 0 && impacts.size > 0;

  const dateFormat = useDateFormat({
    dateStyle: "medium",
  });

  const { insertEntry, updateEntry } = useMoodEntries();

  return (
    <KeyboardAwareScrollView contentContainerClassName="justify-end pb-[env(safe-area-inset-bottom)]">
      <View
        className={twMerge("p-6 gap-2", isLoading && "opacity-30")}
        style={vars(theme)}
        pointerEvents={isLoading ? "none" : "auto"}
      >
        <Stack.Screen
          options={{
            title: isAdding ? "Add entry" : "Edit entry",
            headerRight: () => {
              return (
                <Button
                  title="Save"
                  style={vars(theme)}
                  contentClassName="text-lg"
                  disabled={!canSave}
                  onPress={() => {
                    if (!canSave) return;

                    if (mood === undefined) return;

                    const moodEntry = {
                      date: editingDate,
                      feelings: Array.from(feelings),
                      impacts: Array.from(impacts),
                      value: mood,
                      notes: notes?.trim() || undefined,
                    };

                    if (isAdding) {
                      insertEntry(moodEntry);
                    } else {
                      if (editingID === null)
                        throw new Error("id must not be null here");
                      updateEntry({
                        id: editingID,
                        ...moodEntry,
                      });
                    }
                    router.dismiss();
                  }}
                ></Button>
              );
            },
          }}
        ></Stack.Screen>
        <View className="mb-2">
          <Text className="text-base-content text-lg font-medium leading-snug">
            {dateFormat.format(editingDate)}
          </Text>
          <Text className="text-base-content text-2xl font-bold">
            How was {isToday ? "today" : "the day"}?
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
          Most impactful {isToday ? "today" : "that day"}
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
