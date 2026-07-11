import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { authService } from "../../services/auth";
import type { ApiUser } from "../../services/types";
import { AuthContext, type AuthContextValue } from "./auth-context";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<ApiUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const current = await authService.me();
    setUser(current);
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        if (authService.hasToken()) {
          await refreshUser();
        } else {
          const current = await authService.refresh();
          setUser(current);
        }
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    void bootstrap();
  }, [refreshUser]);

  useEffect(() => {
    const handleUnauthorized = () => {
      setUser(null);
    };
    window.addEventListener("gtgs:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("gtgs:unauthorized", handleUnauthorized);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      role: user?.role ?? null,
      isAuthenticated: Boolean(user),
      isLoading,
      login: async (input) => {
        const current = await authService.login(input);
        setUser(current);
        return current;
      },
      logout,
      refreshUser
    }),
    [isLoading, logout, refreshUser, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
