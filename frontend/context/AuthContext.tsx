import { createContext, ReactNode, useContext, useMemo, useState } from "react";

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthContextType {
  token: string | null;
  setToken: (token: string) => void;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authToken, setAuthToken] = useState<string | null>(null);

  return (
    <AuthContext.Provider value={{ token: authToken, setToken: setAuthToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
};
