import { router, usePathname } from "expo-router";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthContextType {
  token: string | null;
  setToken: (token: string) => void;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authToken, setAuthToken] = useState<string | null>(null);

  const pathName = usePathname();

  useEffect(() => {
    if (
      authToken === null &&
      pathName !== null &&
      pathName !== "/" &&
      !pathName.startsWith("/auth/")
    ) {
      router.dismissAll();
      router.replace("/");
    }
  }, [pathName]);

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
