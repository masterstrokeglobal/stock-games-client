import Admin from "@/models/admin";
import User from "@/models/user";
import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useState,
} from "react";

interface UserContextType {
  userDetails: Admin | User | null;
  setLoadig: (loading: boolean) => void;
  loading: boolean;
  setUser: (details: Admin | User | null) => void;
  isLoggedIn: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useAuthStore = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export const useIsExternalUser = () => {
  const { userDetails } = useAuthStore();
  console.log("userDetails is: ", userDetails);
  return userDetails instanceof User && userDetails.externalUser;
};

export const UserProvider = ({ children }: PropsWithChildren) => {
  const [userDetails, setUser] = useState<Admin | User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const updateUser = (details: Admin | User | null) => {
    setIsLoading(false);
    setUser(details);
  };

  const value: UserContextType = {
    userDetails,
    setLoadig: setIsLoading,
    setUser: updateUser,
    loading: isLoading,
    isLoggedIn: userDetails !== null,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
