import React, { createContext, useContext, useReducer, useEffect } from "react";
import { AuthContextType, User } from "@/types";
import { toast } from "react-hot-toast";
import {
  validateEmail,
  validatePassword,
  validateName,
  authRateLimiter,
  generateSessionToken,
} from "@/lib/security";

/* eslint-disable react-refresh/only-export-components */

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

type AuthAction =
  | { type: "LOGIN_START" }
  | { type: "LOGIN_SUCCESS"; payload: User }
  | { type: "LOGIN_FAILURE"; payload: string }
  | { type: "LOGOUT" }
  | { type: "UPDATE_PROFILE"; payload: Partial<User> }
  | { type: "CLEAR_ERROR" };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGIN_START":
      return { ...state, isLoading: true, error: null };
    case "LOGIN_SUCCESS":
      return { ...state, user: action.payload, isLoading: false, error: null };
    case "LOGIN_FAILURE":
      return { ...state, isLoading: false, error: action.payload };
    case "LOGOUT":
      return { ...state, user: null, isLoading: false, error: null };
    case "UPDATE_PROFILE":
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      };
    case "CLEAR_ERROR":
      return { ...state, error: null };
    default:
      return state;
  }
};

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Mock user database (in real app, this would be API calls)
const MOCK_USERS_KEY = "disney-clone-users";
const CURRENT_USER_KEY = "disney-clone-current-user";

const getMockUsers = (): Record<string, User> => {
  const users = localStorage.getItem(MOCK_USERS_KEY);
  return users ? JSON.parse(users) : {};
};

const saveMockUsers = (users: Record<string, User>) => {
  localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
};

const getCurrentUser = (): User | null => {
  const userJson = localStorage.getItem(CURRENT_USER_KEY);
  return userJson ? JSON.parse(userJson) : null;
};

const saveCurrentUser = (user: User | null) => {
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isLoading: false,
    error: null,
  });

  // Initialize user from localStorage on mount
  useEffect(() => {
    const storedUser = getCurrentUser();
    if (storedUser) {
      dispatch({ type: "LOGIN_SUCCESS", payload: storedUser });
    }
  }, []);

  const createUser = (email: string, _password: string, name: string): User => {
    const now = new Date().toISOString();
    return {
      id: `user_${Date.now()}`,
      email,
      name,
      createdAt: now,
      lastLoginAt: now,
      preferences: {
        theme: "dark",
        language: "en",
        notifications: true,
        autoplay: true,
        subtitles: false,
        quality: "auto",
      },
      watchlist: [],
      favorites: [],
      watchHistory: [],
      continueWatching: [],
    };
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    dispatch({ type: "LOGIN_START" });

    try {
      // Rate limiting check
      if (authRateLimiter.isRateLimited(email)) {
        const remainingTime = Math.ceil(
          authRateLimiter.getRemainingTime(email) / 1000 / 60,
        );
        throw new Error(
          `Too many login attempts. Please try again in ${remainingTime} minutes.`,
        );
      }

      // Validate email format
      const emailValidation = validateEmail(email);
      if (!emailValidation.isValid) {
        throw new Error(emailValidation.error);
      }

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const users = getMockUsers();
      const userKey = Object.keys(users).find(
        (key) => users[key].email === email,
      );

      if (!userKey) {
        authRateLimiter.recordAttempt(email);
        throw new Error("Invalid email or password");
      }

      const user = users[userKey];

      // In a real app, verify password hash
      // For demo purposes, we'll just check if password exists
      if (!password) {
        authRateLimiter.recordAttempt(email);
        throw new Error("Invalid email or password");
      }

      // Update user with new session info
      const updatedUser = {
        ...user,
        lastLoginAt: new Date().toISOString(),
        sessionToken: generateSessionToken(),
      };

      // Update user in storage
      users[userKey] = updatedUser;
      saveMockUsers(users);
      saveCurrentUser(updatedUser);

      dispatch({ type: "LOGIN_SUCCESS", payload: updatedUser });
      toast.success(`Welcome back, ${updatedUser.name}!`);
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Login failed";
      dispatch({ type: "LOGIN_FAILURE", payload: message });
      toast.error(message);
      return false;
    }
  };

  const signup = async (
    email: string,
    password: string,
    name: string,
  ): Promise<boolean> => {
    dispatch({ type: "LOGIN_START" });

    try {
      // Validate inputs
      const emailValidation = validateEmail(email);
      if (!emailValidation.isValid) {
        throw new Error(emailValidation.error);
      }

      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        throw new Error(passwordValidation.error);
      }

      const nameValidation = validateName(name);
      if (!nameValidation.isValid) {
        throw new Error(nameValidation.error);
      }

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const users = getMockUsers();

      // Check if user already exists
      const existingUser = Object.values(users).find(
        (user) => user.email === email,
      );
      if (existingUser) {
        throw new Error("User already exists with this email");
      }

      const newUser = createUser(email, password, name);
      users[newUser.id] = newUser;
      saveMockUsers(users);
      saveCurrentUser(newUser);

      dispatch({ type: "LOGIN_SUCCESS", payload: newUser });
      toast.success(`Welcome to Disney+, ${newUser.name}!`);
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Signup failed";
      dispatch({ type: "LOGIN_FAILURE", payload: message });
      toast.error(message);
      return false;
    }
  };

  const logout = () => {
    saveCurrentUser(null);
    dispatch({ type: "LOGOUT" });
    toast.success("Logged out successfully");
  };

  const updateProfile = async (updates: Partial<User>): Promise<boolean> => {
    if (!state.user) return false;

    try {
      const users = getMockUsers();
      const updatedUser = { ...state.user, ...updates };

      users[state.user.id] = updatedUser;
      saveMockUsers(users);
      saveCurrentUser(updatedUser);

      dispatch({ type: "UPDATE_PROFILE", payload: updates });
      toast.success("Profile updated successfully");
      return true;
    } catch {
      toast.error("Failed to update profile");
      return false;
    }
  };

  const contextValue: AuthContextType = {
    user: state.user,
    login,
    signup,
    logout,
    updateProfile,
    isLoading: state.isLoading,
    error: state.error,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
