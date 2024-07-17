/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useQuery } from "@tanstack/react-query";
import { ax } from "../lib/client";
import { lambdas } from "../lib/constants";

type User = {
  role: "admin" | "customer";
  username: string;
  email: string;
};

export type UserStore = {
  accessToken?: string;
  setAccessToken(t: string): void;
  user?: User;
  setUser(u: User): void;
  logout(): void;
};

const UserContext = createContext<UserStore>({} as UserStore);

export const UserContextProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string>(
    localStorage.getItem("token") || ""
  );

  const [user, setUser] = useState<User>();

  const userQuery = useQuery({
    queryKey: ["user", accessToken],
    queryFn: () =>
      ax
        .get(lambdas.getUserByToken, {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        .then((res) => res.data),
    enabled: !!accessToken,
  });

  useEffect(() => {
    if (userQuery.data) {
      setUser({
        email: userQuery.data.email,
        role: userQuery.data["custom:role"],
        username: userQuery.data["cognito:username"],
      });
    }
  }, [userQuery.data]);

  if (user) {
    console.log({ user });
  }

  return (
    <UserContext.Provider
      value={{
        user,
        accessToken,
        setUser,
        setAccessToken,
        logout: () => {
          localStorage.removeItem("token");
          setAccessToken("");
          setUser(undefined);
        },
      }}
    >
      {userQuery.isFetching && <div>Loading...</div>}
      {!userQuery.isFetching && children}
    </UserContext.Provider>
  );
};

export const useUserStore = () => useContext(UserContext);
