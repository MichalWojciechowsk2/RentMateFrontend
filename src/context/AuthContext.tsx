import { createContext, useContext, useEffect, useState } from "react";
import type { User, LoginUser, RegisterUser } from "../types/User";
import {
  login as loginApi,
  register as registerApi,
  getCurrentUser as getCurrentUserApi,
} from "../api/auth";

type AuthContextType = {
  currentUser: User | null;
  token: string | null;
  login: (data: LoginUser) => Promise<void>;
  register: (data: RegisterUser) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      getCurrentUserApi()
        .then(setCurrentUser)
        .catch(() => {
          logout();
        });
    }
  }, []);

  const login = async (data: LoginUser) => {
    try {
      const response = await loginApi(data);
      const result = response.data;

      setCurrentUser(result.user);
      setToken(result.token);
      localStorage.setItem("user", JSON.stringify(result.user));
      localStorage.setItem("token", result.token);
    } catch (err) {
      console.error("Błąd logowania: ", err);
      throw err;
    }
  };

  const register = async (data: RegisterUser) => {
    try {
      await registerApi(data);
    } catch (err) {
      console.error("Błąd rejestracji: ", err);
      throw err;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{ currentUser: currentUser, token, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
