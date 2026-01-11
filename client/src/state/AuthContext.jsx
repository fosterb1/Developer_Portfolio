import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { request } from "../services/api";

const AuthContext = createContext(undefined);
const STORAGE_KEY = "portfolio.auth";

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return "";
    try {
      const parsed = JSON.parse(stored);
      return parsed.token || "";
    } catch (_) {
      return "";
    }
  });
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    try {
      const parsed = JSON.parse(stored);
      return parsed.user || null;
    } catch (_) {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (token && user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ token, user }));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [token, user]);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError("");
    try {
      const data = await request("/api/auth/login", {
        method: "POST",
        data: { email, password },
      });
      setToken(data.token);
      setUser(data.user);
      return data.user;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setToken("");
    setUser(null);
    setError("");
  }, []);

  const value = useMemo(
    () => ({ token, user, loading, error, login, logout, setError }),
    [token, user, loading, error, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};
