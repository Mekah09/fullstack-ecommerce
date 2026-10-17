import { useCallback, useEffect, useState } from "react";
import * as api from "../services/api";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  useEffect(() => {
    let active = true;
    api
      .getCurrentUser()
      .then((account) => {
        if (active) setUser(account);
      })
      .catch(() => {})
      .finally(() => {
        if (active) setAuthLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);
  const authenticate = useCallback(async (data) => {
    const account =
      data.mode === "demo"
        ? await api.signIn({ ...data, password: "demo-access" })
        : await (data.mode === "signup" ? api.signUp(data) : api.signIn(data));
    setUser(account);
    return account;
  }, []);
  const logout = useCallback(async () => {
    await api.signOut();
    setUser(null);
  }, []);
  return { user, authLoading, authenticate, logout };
}
