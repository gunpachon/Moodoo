import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuth } from "./AuthContext";
import { getYYYYMMDD } from "@/lib/utils";

interface Challenge {
  id: number;
  name: string;
  completed: boolean;
}

interface ChallangesContextType {
  challenges: Challenge[];
  setDone: (challenge: Challenge, completed: boolean) => void;
  addChallenge: (name: string, isCustom: boolean) => Promise<void>;
}

interface ApiResponseChallenge {
  completed: boolean;
  created_at: string;
  date: string;
  id: number;
  name: string;
}

const ChallengesContext = createContext<ChallangesContextType | null>(null);

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

export function ChallengesProvider({ children }: { children: ReactNode }) {
  const { token } = useAuth();

  const [challenges, setChallenges] = useState<Challenge[]>([]);

  const fetchChallenges = useCallback(async () => {
    const today = new Date();

    if (token === null) {
      throw new Error("Token must not be null here");
    }

    const response = await fetch(
      `${BASE_URL}/api/get_challenge?date=${getYYYYMMDD(today)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json", // Though GET doesn't typically need content-type, it's good practice sometimes
          Authorization: `Bearer ${token}`, // Include the JWT token
        },
      },
    );

    if (response.ok) {
      const apiResponse = (await response.json()) as ApiResponseChallenge[];

      const challenges: Challenge[] = apiResponse.map((apiChallenge) => ({
        id: apiChallenge.id,
        name: apiChallenge.name,
        completed: apiChallenge.completed,
      }));

      setChallenges(challenges);
    } else {
      console.error(
        "[ChallengeContext] Request got response " + response.status,
      );
      setChallenges([]);
    }
  }, [token]);

  useEffect(() => {
    if (token !== null) fetchChallenges();
  }, [token]);

  const setDone = useCallback(
    (challenge: Challenge, completed: boolean) => {
      setChallenges((challenges) =>
        challenges.map((c) => {
          if (c.id !== challenge.id) return c;

          return {
            ...c,
            completed,
          };
        }),
      );

      fetch(`${BASE_URL}/api/update_challenge?id=${challenge.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json", // Though GET doesn't typically need content-type, it's good practice sometimes
          Authorization: `Bearer ${token}`, // Include the JWT token
        },
        body: JSON.stringify({
          completed,
        }),
      }).then((response) => {
        if (response.ok) {
          fetchChallenges();
        } else {
          console.error(
            "[ChallengesContext] Update request got response " +
              response.status,
          );
        }
      });
    },
    [token],
  );

  const addChallenge = useCallback(
    async (name: string, isCustom: boolean) => {
      const response = await fetch(`${BASE_URL}/api/add_challenge`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Though GET doesn't typically need content-type, it's good practice sometimes
          Authorization: `Bearer ${token}`, // Include the JWT token
        },
        body: JSON.stringify({
          date: getYYYYMMDD(new Date()),
          is_custom: isCustom,
          name: name,
        }),
      });

      if (response.ok) {
        await fetchChallenges();
      } else {
        console.log(
          "[ChallengesContext] Add request got response " + response.status,
        );
      }
    },
    [token],
  );

  return (
    <ChallengesContext.Provider value={{ challenges, setDone, addChallenge }}>
      {children}
    </ChallengesContext.Provider>
  );
}

export const useChallenges = (): ChallangesContextType => {
  const context = useContext(ChallengesContext);
  if (!context) {
    throw new Error("useChallenges must be used within a ChallengesProvider");
  }
  return context;
};
