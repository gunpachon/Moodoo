import { sameDay } from "@/lib/utils";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";
import { useAuth } from "./AuthContext";

export interface MoodEntry {
  id: number;
  value: 1 | 2 | 3 | 4 | 5;
  feelings: string[];
  impacts: string[];
  date: Date;
  notes?: string;
}

interface MoodEntriesCache {
  [monthYear: string]: {
    entries: MoodEntry[];
    cachedAt: Date;
  };
}

interface MoodEntriesContextType {
  entriesCache: MoodEntriesCache;
  // isLoading: boolean;
  getLoadedEntries: (year: number, month: number) => MoodEntry[] | undefined;
  fetchEntries: (year: number, month: number) => Promise<void>;
  insertEntry: (entry: Omit<MoodEntry, "id">) => void;
  updateEntry: (entry: MoodEntry) => void;
}

const MoodEntriesContext = createContext<MoodEntriesContextType | null>(null);

interface ApiResponseMoodEntry {
  id: number;
  created_at: string; // date-time
  date: string; // YYYY-MM-DD
  time: string; // HH:MM:SS
  mood_level: 1 | 2 | 3 | 4 | 5; // 1-5
  tags: string[]; // Array of strings
  impact: string[]; // Array of strings
  note: string | null; // Optional note
  user_id: number;
}

function assertToken(token: string | null): asserts token is string {
  if (token === null) throw new Error("Token must not be null at this point");
}

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

// Helper function to transform API response to local MoodEntry format
const transformApiResponseToMoodEntry = (
  apiEntry: ApiResponseMoodEntry,
): MoodEntry => ({
  id: apiEntry.id,
  value: apiEntry.mood_level,
  feelings: apiEntry.tags,
  impacts: apiEntry.impact,
  // Combine date and time strings into a single Date object
  date: new Date(`${apiEntry.date}T${apiEntry.time}`),
  notes: apiEntry.note ?? undefined, // Handle null note
});

const transformMoodEntryToApiBody = (
  entry: MoodEntry | Omit<MoodEntry, "id">,
) => {
  const year = entry.date.getFullYear().toString().padStart(4, "0");
  const month = (entry.date.getMonth() + 1).toString().padStart(2, "0");
  const date = entry.date.getDate().toString().padStart(2, "0");

  return {
    mood_level: entry.value,
    tags: entry.feelings,
    impact: entry.impacts,
    date: `${year}-${month}-${date}`,
    time: "00:00", // HH:MM:SS
    note: entry.notes ?? null, // Convert undefined to null for API
  };
};

export function MoodEntriesProvider({ children }: { children: ReactNode }) {
  const { token } = useAuth();

  const [entriesCache, setEntriesCache] = useState<MoodEntriesCache>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getLoadedEntries = useCallback(
    (year: number, month: number) => {
      const monthYearString = `${year}-${month.toString().padStart(2, "0")}`;

      return entriesCache[monthYearString]?.entries as MoodEntry[] | undefined;
    },
    [entriesCache],
  );

  const fetchEntries = useCallback(
    async (year: number, month: number) => {
      console.log(`[MoodEntriesContext] Fetching ${year}-${month}`);
      const monthYearString = `${year}-${month.toString().padStart(2, "0")}`;

      setIsLoading(true);

      // TODO: fetch data instead of mock data
      // const fetchedData: MoodEntry[] = generateMockData(year, month);

      let fetchedData: MoodEntry[] = [];
      const url = `${BASE_URL}/api/get_moods_byMonth?year=${year}&month=${month}`;

      assertToken(token);

      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json", // Though GET doesn't typically need content-type, it's good practice sometimes
            Authorization: `Bearer ${token}`, // Include the JWT token
          },
        });

        if (!response.ok) {
          // Handle non-2xx responses
          const errorBody = await response.text(); // Read as text for potentially better error info
          console.error(
            `[MoodEntriesContext] API Error ${response.status}: ${response.statusText}`,
            errorBody,
          );
          throw new Error(`API request failed with status ${response.status}`);
        }

        const apiResponse: ApiResponseMoodEntry[] = await response.json();

        // Transform API response objects to your MoodEntry interface
        fetchedData = apiResponse.map((apiEntry) => ({
          // Mapping based on analysis:
          value: apiEntry.mood_level,
          feelings: apiEntry.tags, // Mapping API 'tags' to local 'feelings'
          impacts: apiEntry.impact, // Mapping API 'impact' to local 'impacts'
          date: new Date(apiEntry.date), // Convert date string to Date object
          notes: apiEntry.note ?? undefined, // Map note, handle null
          id: apiEntry.id, // Optional: if you added id to MoodEntry interface
        }));

        // Sort entries by date for consistent ordering (optional but good practice)
        fetchedData.sort((a, b) => a.date.getTime() - b.date.getTime());

        console.log(
          `[MoodEntriesContext] Successfully fetched ${fetchedData.length} entries for ${monthYearString}`,
        );
      } catch (error) {
        console.error(
          "[MoodEntriesContext] Error fetching mood entries:",
          error,
        );
        // Depending on requirements, you might want to set an error state or return an empty array
        // Keeping fetchedData as empty array on error
        fetchedData = [];
      } finally {
        setIsLoading(false);
      }

      setEntriesCache((prevCache) => ({
        ...prevCache,
        [monthYearString]: {
          entries: fetchedData,
          cachedAt: new Date(),
        },
      }));
    },
    [entriesCache, token],
  );

  const insertEntry = useCallback(
    async (entry: Omit<MoodEntry, "id">): Promise<MoodEntry | undefined> => {
      console.log(`[MoodEntriesContext] Inserting mood entry...`);
      setIsLoading(true);

      assertToken(token);

      try {
        const apiBody = transformMoodEntryToApiBody(entry);

        const response = await fetch(`${BASE_URL}/api/add_mood`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include the JWT token
          },
          body: JSON.stringify(apiBody),
        });

        if (!response.ok) {
          // Handle non-2xx responses
          const errorBody = await response.text(); // Read as text for potentially better error info
          console.error(
            `[MoodEntriesContext] API Error ${response.status}: ${response.statusText}`,
            errorBody,
          );
          throw new Error(`API request failed with status ${response.status}`);
        }

        const apiResponse = await response.json();

        // Transform the API response back into your local MoodEntry interface
        const savedEntry = transformApiResponseToMoodEntry(apiResponse);

        // --- Update the local cache with the newly added entry ---
        const monthYearString = `${savedEntry.date.getFullYear()}-${(savedEntry.date.getMonth() + 1).toString().padStart(2, "0")}`;

        setEntriesCache((prevCache) => {
          const monthCache = prevCache[monthYearString] || [];

          const filteredEntries = monthCache.entries.filter(
            (storedEntry) => !sameDay(storedEntry.date, savedEntry.date),
          );

          const newMonthEntries = [...filteredEntries, savedEntry];
          // Sort entries by date
          newMonthEntries.sort((a, b) => a.date.getTime() - b.date.getTime());

          return {
            ...prevCache,
            [monthYearString]: {
              entries: newMonthEntries,
              cachedAt: monthCache.cachedAt,
            },
          };
        });
        // --- End Cache Update ---

        console.log(
          `[MoodEntriesContext] Successfully added mood entry with ID ${savedEntry.id}`,
        );

        fetchEntries(entry.date.getFullYear(), entry.date.getMonth() + 1);
        return savedEntry; // Return the successfully saved entry
      } catch (error) {
        console.error(
          "[MoodEntriesContext] Error during insert operation:",
          error,
        );
        return undefined; // Return undefined on failure
      } finally {
        setIsLoading(false);
      }
    },
    [token],
  ); // Dependencies: token for auth

  const updateEntry = useCallback(
    async (entry: MoodEntry): Promise<MoodEntry | undefined> => {
      console.log(
        `[MoodEntriesContext] Updating mood entry with ID ${entry.id}...`,
      );
      setIsLoading(true);

      if (entry.id === undefined) {
        console.error(
          "[MoodEntriesContext] Cannot update entry without an ID.",
        );
        setIsLoading(false);
        return undefined; // Cannot update without ID
      }

      assertToken(token);

      try {
        const apiBody = transformMoodEntryToApiBody(entry);

        const response = await fetch(
          `${BASE_URL}/api/update_mood?mood_id=${entry.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // Include the JWT token
            },
            body: JSON.stringify(apiBody),
          },
        );

        if (!response.ok) {
          // Handle non-2xx responses
          const errorBody = await response.text(); // Read as text for potentially better error info
          console.error(
            `[MoodEntriesContext] API Error ${response.status}: ${response.statusText}`,
            errorBody,
          );
          throw new Error(`API request failed with status ${response.status}`);
        }

        const apiResponse = await response.json();

        // Transform the API response back into your local MoodEntry interface
        const savedEntry = transformApiResponseToMoodEntry(apiResponse);

        // --- Update the local cache with the updated entry ---
        const monthYearString = `${savedEntry.date.getFullYear()}-${(savedEntry.date.getMonth() + 1).toString().padStart(2, "0")}`;

        setEntriesCache((prevCache) => {
          const monthCache = prevCache[monthYearString] || []; // Get existing or start with empty array

          // Filter out the *specific* entry being updated by its ID
          const filteredEntries = monthCache.entries.filter(
            (storedEntry) => storedEntry.id !== savedEntry.id,
          );

          const newMonthEntries = [...filteredEntries, savedEntry];
          // Sort entries by date
          newMonthEntries.sort((a, b) => a.date.getTime() - b.date.getTime());

          return {
            ...prevCache,
            [monthYearString]: {
              entries: newMonthEntries,
              cachedAt: monthCache.cachedAt,
            },
          };
        });
        // --- End Cache Update ---

        console.log(
          `[MoodEntriesContext] Successfully updated mood entry with ID ${savedEntry.id}`,
        );

        fetchEntries(entry.date.getFullYear(), entry.date.getMonth() + 1);
        return savedEntry; // Return the successfully saved entry
      } catch (error) {
        console.error(
          `[MoodEntriesContext] Error during update operation for ID ${entry.id}:`,
          error,
        );
        return undefined; // Return undefined on failure
      } finally {
        setIsLoading(false);
      }
    },
    [token],
  ); // Dependencies: token for auth

  return (
    <MoodEntriesContext.Provider
      value={{
        entriesCache,
        getLoadedEntries,
        fetchEntries,
        insertEntry,
        updateEntry,
      }}
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

// function generateMockData(year: number, month: number): MoodEntry[] {
//   const feelingsMap = {
//     Neutral: [
//       "Content",
//       "Calm",
//       "Peaceful",
//       "Indifferent",
//       "Drained",
//       "Relaxed",
//     ],
//     Good: [
//       "Relaxed",
//       "Proud",
//       "Excited",
//       "Confident",
//       "Peaceful",
//       "Satisfied",
//       "Passionate",
//       "Grateful",
//       "Relieved",
//     ],
//     Bad: [
//       "Lonely",
//       "Stressed",
//       "Anxious",
//       "Scared",
//       "Hopeless",
//       "Disappointed",
//       "Angry",
//       "Embarrassed",
//     ],
//   };

//   const impactsList = [
//     "Hobbies",
//     "Health",
//     "Fitness",
//     "Spirituality",
//     "Family",
//     "Friends",
//     "Partner",
//     "Dating",
//     "Work",
//     "Travel",
//     "Education",
//     "Weather",
//     "Money",
//   ];

//   function getRandomSubarray<T>(arr: T[], min: number, max: number): T[] {
//     const shuffled = [...arr].sort(() => 0.5 - Math.random());
//     const count = Math.floor(Math.random() * (max - min + 1)) + min;
//     return shuffled.slice(0, count);
//   }

//   function generateMoodEntry(date: Date): MoodEntry {
//     const value = (Math.floor(Math.random() * 5) + 1) as 1 | 2 | 3 | 4 | 5;
//     let potentialFeelings: string[];

//     if (value <= 2) {
//       potentialFeelings = feelingsMap.Bad;
//     } else if (value === 3) {
//       potentialFeelings = feelingsMap.Neutral;
//     } else {
//       potentialFeelings = feelingsMap.Good;
//     }

//     const feelings = getRandomSubarray(potentialFeelings, 1, 3);
//     const impacts = getRandomSubarray(impactsList, 1, 4);

//     return {
//       value,
//       feelings,
//       impacts,
//       date,
//     };
//   }

//   function getAllDatesInMonth(year: number, monthIndex: number): Date[] {
//     const dates = [];
//     // Create a Date object for the first day of the next month.
//     // Subtracting one day from this will give us the last day of the current month.
//     const lastDayOfCurrentMonth = new Date(year, monthIndex + 1, 0).getDate();

//     // Loop through each day of the month
//     for (let day = 1; day <= lastDayOfCurrentMonth; day++) {
//       // Create a new Date object for the current year, month, and day
//       dates.push(new Date(year, monthIndex, day));
//     }

//     return dates;
//   }

//   const dates = getAllDatesInMonth(year, month - 1);
//   return dates
//     .filter((date) => date < new Date())
//     .map((date) => generateMoodEntry(date))
//     .filter((_) => Math.random() > 0.2);
// }
