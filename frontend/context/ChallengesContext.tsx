import { createContext, ReactNode, useContext, useState } from "react";

interface Challenge {
  id: number;
  text: string;
  completed: boolean;
}

interface ChallangesContextType {
  challenges: Challenge[];
  setDone: (challenge: Challenge, completed: boolean) => void;
  addChallenge: (challenge: Challenge) => void;
}

const ChallengesContext = createContext<ChallangesContextType | null>(null);

export function ChallengesProvider({ children }: { children: ReactNode }) {
  const [challenges, setChallenges] = useState<Challenge[]>([
    { id: 1, text: "Read", completed: false },
    { id: 2, text: "Walk", completed: false },
  ]);

  const setDone = (challenge: Challenge, completed: boolean) => {
    setChallenges((challenges) =>
      challenges.map((c) => {
        if (c.id !== challenge.id) return c;

        return {
          ...c,
          completed,
        };
      }),
    );
  };

  const addChallenge = (challenge: Challenge) => {
    setChallenges((challenges) => [...challenges, challenge]);
  };

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
