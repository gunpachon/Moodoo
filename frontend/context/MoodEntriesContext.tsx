import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";

export interface MoodEntry {
  value: 1 | 2 | 3 | 4 | 5;
  feelings: string[];
  impacts: string[];
  date: Date;
  notes?: string;
}

interface MoodEntriesCache {
  [monthYear: string]: MoodEntry[];
}

interface MoodEntriesContextType {
  moodEntries: MoodEntriesCache;
  isLoading: boolean;
  fetchEntries: (year: number, month: number) => Promise<MoodEntry[]>;
  addEntry: (entry: MoodEntry) => void;
}

const MoodEntriesContext = createContext<MoodEntriesContextType | null>(null);

export function MoodEntriesProvider({ children }: { children: ReactNode }) {
  const [moodEntries, setMoodEntries] = useState<MoodEntriesCache>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchEntries = useCallback(
    async (year: number, month: number) => {
      const monthYearString = `${year}-${month.toString().padStart(2, "0")}`;

      const cachedData = moodEntries[monthYearString] as
        | MoodEntry[]
        | undefined;
      console.log(moodEntries);
      if (cachedData !== undefined) return cachedData;

      setIsLoading(true);

      const fetchedData: MoodEntry[] = generateMockData(year, month);
      setMoodEntries((prevCache) => ({
        ...prevCache,
        [monthYearString]: fetchedData,
      }));

      setIsLoading(false);

      return fetchedData;
    },
    [moodEntries],
  );

  const addEntry = useCallback((entry: MoodEntry) => {
    const monthYearString = `${entry.date.getFullYear()}-${(entry.date.getMonth() + 1).toString().padStart(2, "0")}`;

    setMoodEntries((prevCache) => ({
      ...prevCache,
      [monthYearString]: prevCache[monthYearString]
        ? [...prevCache[monthYearString], entry]
        : [entry],
    }));
  }, []);

  return (
    <MoodEntriesContext.Provider
      value={{ moodEntries, isLoading, fetchEntries, addEntry }}
    >
      {children}
    </MoodEntriesContext.Provider>
  );
}

export const useMoodEntries = (): MoodEntriesContextType => {
  const context = useContext(MoodEntriesContext);
  if (!context) {
    throw new Error("useMoodEntries must be used within a MoodEntriesProvider");
  }
  return context;
};

function generateMockData(year: number, month: number): MoodEntry[] {
  const feelingsMap = {
    Neutral: [
      "Content",
      "Calm",
      "Peaceful",
      "Indifferent",
      "Drained",
      "Relaxed",
    ],
    Good: [
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
    Bad: [
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

  const impactsList = [
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

  function getRandomSubarray<T>(arr: T[], min: number, max: number): T[] {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    const count = Math.floor(Math.random() * (max - min + 1)) + min;
    return shuffled.slice(0, count);
  }

  function generateMoodEntry(date: Date): MoodEntry {
    const value = (Math.floor(Math.random() * 5) + 1) as 1 | 2 | 3 | 4 | 5;
    let potentialFeelings: string[];

    if (value <= 2) {
      potentialFeelings = feelingsMap.Bad;
    } else if (value === 3) {
      potentialFeelings = feelingsMap.Neutral;
    } else {
      potentialFeelings = feelingsMap.Good;
    }

    const feelings = getRandomSubarray(potentialFeelings, 1, 3);
    const impacts = getRandomSubarray(impactsList, 1, 4);

    return {
      value,
      feelings,
      impacts,
      date,
    };
  }

  function getAllDatesInMonth(year: number, monthIndex: number): Date[] {
    const dates = [];
    // Create a Date object for the first day of the next month.
    // Subtracting one day from this will give us the last day of the current month.
    const lastDayOfCurrentMonth = new Date(year, monthIndex + 1, 0).getDate();

    // Loop through each day of the month
    for (let day = 1; day <= lastDayOfCurrentMonth; day++) {
      // Create a new Date object for the current year, month, and day
      dates.push(new Date(year, monthIndex, day));
    }

    return dates;
  }

  const dates = getAllDatesInMonth(year, month - 1);
  return dates.map((date) => generateMoodEntry(date));
}
