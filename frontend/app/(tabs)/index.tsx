import { Platform, Pressable } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/ui/Button";
import { ThemedView } from "@/components/ThemedView";
import { useState } from "react";
import { useThemeColor } from "@/hooks/useThemeColor";
import { PressableWithOpacity } from "@/components/PressableWithOpacity";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Checkbox } from "@/components/ui/Checkbox";
import { MoodFace } from "@/components/ui/MoodFace";
import { IconSymbol } from "@/components/ui/IconSymbol";

import { getCalendars } from "expo-localization";

function ChallengeCheckbox({ challenge }: { challenge: string }) {
  const [checked, setChecked] = useState(false);

  return (
    <PressableWithOpacity
      style={{
        paddingHorizontal: 12,
        paddingVertical: 8,
      }}
      onPress={() => {
        setChecked(!checked);
      }}
    >
      <ThemedView
        style={{
          flexDirection: "row",
          gap: 8,
          alignItems: "center",
        }}
      >
        <Checkbox checked={checked} />
        <ThemedText type="default">{challenge}</ThemedText>
      </ThemedView>
    </PressableWithOpacity>
  );
}

interface Mood {
  number: 1 | 2 | 3 | 4 | 5;
  description: string[];
}

export default function HomeScreen() {
  const topPadding = useSafeAreaInsets().top;
  const iconColor = useThemeColor("icon");

  const [recordedToday, setRecordedToday] = useState(false);
  const [mood, setMood] = useState<Mood | undefined>();

  const calendar = getCalendars()[0];

  const format = new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    calendar: calendar.calendar ?? undefined,
  });
  const todayText = format.format(new Date());

  return (
    <ThemedView
      style={{
        paddingHorizontal: 32,
        paddingTop: topPadding + 16,
        paddingBottom: 16,
        gap: 16,
      }}
    >
      <ThemedView
        style={{
          marginBottom: 12,
        }}
      >
        <ThemedText type="subtitle">What's up, Ideal!</ThemedText>
      </ThemedView>
      <ThemedView>
        <ThemedText type="subtitle" style={{ marginBottom: 8 }}>
          Today's mood
        </ThemedText>
        <ThemedView
          backgroundColor="card"
          style={{
            borderRadius: 8,
            justifyContent: "center",
            alignItems: "center",
            height: 100,
          }}
        >
          {mood !== undefined ? (
            <Pressable
              style={({ pressed }) => ({
                opacity: pressed ? 0.7 : 1,
                // backgroundColor: "#F00",
                padding: 24,
                paddingEnd: 36,
                width: "100%",
                height: "100%",
                justifyContent: "center",
              })}
            >
              <IconSymbol
                color={iconColor}
                size={Platform.select({
                  ios: 16,
                  android: 24,
                })}
                name="chevron.right"
                style={{
                  position: "absolute",
                  end: Platform.select({
                    android: 12,
                    ios: 16,
                  }),
                }}
              />
              <ThemedView
                style={{
                  gap: 16,
                  width: "100%",
                  height: "100%",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <MoodFace mood={mood.number} size={52} />
                <ThemedView
                  style={{
                    flexShrink: 1,
                    alignItems: "flex-start",
                    // backgroundColor: "#F00",
                  }}
                >
                  <ThemedText type="defaultSemiBold">{todayText}</ThemedText>
                  <ThemedText>{mood.description.join(", ")}</ThemedText>
                </ThemedView>
              </ThemedView>
            </Pressable>
          ) : (
            <ThemedView
              style={{
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ThemedText>Not recorded yet</ThemedText>
              <Button
                title="Record mood"
                iconName="square.and.pencil"
                style={{ padding: 8 }}
                onPress={() =>
                  setMood({
                    number: 4,
                    description: ["amazed", "relaxed", "proud"],
                  })
                }
              ></Button>
            </ThemedView>
          )}
        </ThemedView>
      </ThemedView>
      <ThemedView>
        <ThemedText type="subtitle" style={{ marginTop: 16, marginBottom: 8 }}>
          Challenges
        </ThemedText>
        <ThemedView
          backgroundColor="card"
          style={{
            borderRadius: 8,
            justifyContent: "flex-start",
            alignItems: "stretch",
            paddingHorizontal: 8,
            paddingVertical: 12,
            // paddingHorizontal: 24,
            // paddingVertical: 20,
            gap: 4,
          }}
        >
          <ChallengeCheckbox challenge="Abc" />
          <ChallengeCheckbox challenge="defg" />
          <Button
            title="Add challenge"
            iconName="plus"
            colorName="subtext"
            style={{
              paddingHorizontal: 14,
              paddingVertical: 8,
              gap: 8,
            }}
          ></Button>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}
