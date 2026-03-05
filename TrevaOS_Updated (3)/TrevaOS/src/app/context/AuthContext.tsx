import { createContext, useContext, useState, ReactNode } from "react";

export type AuthUserType = "super_admin" | "outlet_owner";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  type: AuthUserType;
  outletIds?: number[];
}

interface DemoUser extends AuthUser {
  password: string;
}

const DEMO_USERS: DemoUser[] = [
  { id: "u-1", email: "admin@trevaos.com",  password: "admin123", type: "super_admin",  name: "TrevaOS Admin"  },
  { id: "u-2", email: "owner@downtown.com", password: "owner123", type: "outlet_owner", name: "Rajesh Kumar",  outletIds: [1] },
  { id: "u-3", email: "owner@mall.com",     password: "owner123", type: "outlet_owner", name: "Priya Sharma",  outletIds: [2] },
];

interface AuthContextValue {
  authUser: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  register: (data: RegisterData) => boolean;
  logout: () => void;
}

export interface RegisterData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  restaurantName: string;
  numOutlets: string;
}

const SESSION_KEY = "trevaos_auth_user";

function readSession(): AuthUser | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authUser, setAuthUser] = useState<AuthUser | null>(readSession);

  function login(email: string, password: string): boolean {
    const user = DEMO_USERS.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (user) {
      const { password: _pw, ...authData } = user;
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(authData));
      setAuthUser(authData);
      return true;
    }
    return false;
  }

  function register(_data: RegisterData): boolean {
    // In a real app this would create the user; here we just simulate success
    return true;
  }

  function logout() {
    sessionStorage.removeItem(SESSION_KEY);
    setAuthUser(null);
  }

  return (
    <AuthContext.Provider value={{ authUser, isAuthenticated: !!authUser, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
