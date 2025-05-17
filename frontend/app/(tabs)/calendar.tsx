import { Button } from "@/components/ui/Button";
import { MoodFace } from "@/components/ui/MoodFace";
import { useBottomTabOverflow } from "@/components/ui/TabBarBackground.ios";
import { MoodEntry, useMoodEntries } from "@/context/MoodEntriesContext";
import { useDateFormat } from "@/hooks/useDateFormat";
import { useEffect, useState, useTransition } from "react";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { twMerge } from "tailwind-merge";
import { LineChart as _LineChart } from "react-native-gifted-charts";
import { cssInterop } from "nativewind";

const LineChart = cssInterop(_LineChart, {
  xAxisClassName: {
    target: "xAxisLabelTextStyle",
  },
  yAxisClassName: {
    target: "yAxisTextStyle",
  },
  yAxisLineClassName: {
    target: false,
    nativeStyleToProp: {
      color: "yAxisColor",
    },
  },
  xAxisLineClassName: {
    target: false,
    nativeStyleToProp: {
      color: "xAxisColor",
    },
  },
  lineClassName: {
    target: false,
    nativeStyleToProp: {
      color: "color",
    },
  },
  pointsClassName: {
    target: false,
    nativeStyleToProp: {
      color: "dataPointsColor",
    },
  },
});

export default function CalendarScreen() {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth();

  const monthFormat = useDateFormat({ month: "long", year: "numeric" });
  const dayFormat = useDateFormat({ day: "numeric" });

  const [viewMonth, setViewMonth] = useState(month);
  const firstDay = new Date(year, viewMonth, 1);
  const firstWeekday = firstDay.getDay();

  const lastDay = new Date(year, viewMonth + 1, 0);

  const tabOverflow = useBottomTabOverflow();
  const safeAreaInsets = useSafeAreaInsets();

  const { fetchEntries } = useMoodEntries();
  const [entries, setEntries] = useState<MoodEntry[] | undefined>();

  const [isPending, startTransition] = useTransition();

  function sameDay(date1: Date, date2: Date) {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  const chartData: Array<MoodEntry | { value: undefined; date: Date }> = [];
  for (let day = firstDay.getDate(); day <= lastDay.getDate(); day++) {
    const date = new Date(year, viewMonth, day);
    chartData.push(
      entries?.find((entry) => sameDay(entry.date, date)) ?? {
        value: undefined,
        date,
      },
    );
  }

  useEffect(() => {
    const dateToRequest = new Date(year, viewMonth, 1);

    fetchEntries(
      dateToRequest.getFullYear(),
      dateToRequest.getMonth() + 1,
    ).then((entries) => {
      setEntries(entries);
    });
  }, [viewMonth]);

  return (
    <ScrollView
      className="mt-[env(safe-area-inset-top)]"
      style={{ marginBottom: tabOverflow + safeAreaInsets.bottom }}
    >
      <View className="py-4">
        <View className="mb-4 px-8">
          <Text className="text-base-content text-xl font-semibold opacity-75">
            Calendar view
          </Text>
          <Text className="text-base-content text-3xl font-bold">
            {monthFormat.format(new Date(year, viewMonth, 1))}
          </Text>
        </View>

        <View className="gap-4 p-4 pt-2 bg-base-200 rounded-lg mx-4">
          <View className="flex-row gap-4 py-2 border-base-100 border-b-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
              (weekday) => (
                <Text
                  className="text-base-content grow basis-0 text-center font-bold"
                  key={weekday}
                >
                  {weekday}
                </Text>
              ),
            )}
          </View>
          {[0, 1, 2, 3, 4].map((i) => (
            <View className="flex-row gap-4" key={i}>
              {[0, 1, 2, 3, 4, 5, 6].map((j) => {
                const date = i * 7 + j + 1 - firstWeekday;

                const shouldShow = date > 0 && date <= lastDay.getDate();

                const entry = entries?.find(
                  (entry) => entry.date.getDate() === date,
                );

                return (
                  <View
                    className={twMerge(
                      "grow shrink gap-1",
                      !shouldShow && "invisible",
                    )}
                    key={j}
                  >
                    <MoodFace
                      mood={entry?.value}
                      className="size-auto aspect-square"
                      iconClassName={
                        entry?.value === undefined ? "opacity-10" : undefined
                      }
                    />
                    <Text className="text-base-content text-center font-medium">
                      {date}
                    </Text>
                  </View>
                );
              })}
            </View>
          ))}
        </View>
        <View className="py-2 px-4 flex-row gap-1 justify-between">
          <Button
            iconName="arrowtriangle.left.circle.fill"
            className="px-4 py-2 bg-base-200 rounded-lg gap-0"
            textClassName="mx-2"
            contentClassName="text-base-content"
            iconClassName="size-6"
            title="Prev"
            onPress={() =>
              startTransition(() => {
                setViewMonth((m) => m - 1);
                setEntries(undefined);
              })
            }
          ></Button>
          {viewMonth !== month && (
            <Button
              title="Go to present"
              contentClassName="text-base-content"
              onPress={() =>
                startTransition(() => {
                  setViewMonth(month);
                  setEntries(undefined);
                })
              }
            ></Button>
          )}
          <Button
            iconName="arrowtriangle.right.circle.fill"
            className="px-4 py-2 bg-base-200 rounded-lg gap-0"
            textClassName="mx-2"
            contentClassName="text-base-content"
            iconClassName="size-6"
            title="Next"
            iconEnd={true}
            onPress={() =>
              startTransition(() => {
                setViewMonth((m) => m + 1);
                setEntries(undefined);
              })
            }
          ></Button>
        </View>

        <View className="mt-4">
          <Text className="mx-6 text-base-content text-2xl font-bold mb-3">
            Monthly trends
          </Text>
          <View className="mx-4 bg-base-200 rounded-lg overflow-hidden">
            <LineChart
              data={chartData?.map((entry) => ({
                value: entry?.value !== undefined ? entry.value - 1 : undefined,
                label: dayFormat.format(entry.date),
              }))}
              yAxisLabelTexts={["1", "2", "3", "4", "5"]}
              initialSpacing={15}
              spacing={20}
              maxValue={4}
              mostNegativeValue={0}
              stepValue={1}
              adjustToWidth={true}
              lineClassName="text-secondary"
              pointsClassName="text-secondary"
              xAxisClassName="text-base-content"
              yAxisClassName="text-base-content"
              xAxisLineClassName="text-base-content"
              yAxisLineClassName="text-base-content"
              showDataPointsForMissingValues={false}
              extrapolateMissingValues={false}
            ></LineChart>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
