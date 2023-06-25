import useStorage from "@/hooks/useStorage";
import React, { createContext, useContext, useState, FC } from "react";

type loginContext = {
  name: string;
  setName?: React.Dispatch<React.SetStateAction<string>>;
  email: string;
  setEmail?: React.Dispatch<React.SetStateAction<string>>;
  password: string;
  setPassword?: React.Dispatch<React.SetStateAction<string>>;
  token?: string;
  setToken?: React.Dispatch<React.SetStateAction<string>>;
  isLoggedIn?: string | boolean;
  setIsLoggedIn?: React.Dispatch<React.SetStateAction<string | boolean>>;
};

export let loginContext = createContext<loginContext>({
  name: "",
  email: "",
  password: "",
  token: "Bearer",
  setToken: function () {},
  setName: function () {},
  setEmail: function () {},
  setPassword: function () {},
});

interface Props {
  children: React.ReactNode;
}

let initName = useStorage.getItem("name") || "";
let initEmail = useStorage.getItem("email") || "";
let initPassword = useStorage.getItem("password") || "";
let initToken = useStorage.getItem("token") || "";
let initLoggedIn = useStorage.getItem("isLoggedIn") || false;

export const LoginProvider: FC<Props> = ({ children }: Props) => {
  let [name, setName] = useState(initName);
  let [email, setEmail] = useState(initEmail);
  let [password, setPassword] = useState(initPassword);
  let [token, setToken] = useState(initToken);
  let [isLoggedIn, setIsLoggedIn] = useState(initLoggedIn);
  let providedValue: loginContext = {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    token,
    setToken,
    isLoggedIn,
    setIsLoggedIn,
  };
  return (
    <loginContext.Provider value={providedValue}>
      {children}
    </loginContext.Provider>
  );
};

export default function useLogin() {
  return useContext(loginContext);
}
