import React from "react";
import AuthenticationError from "@/lib/AuthenticationError";
import useFetch from "@/hooks/useFetch";

class Auth {
  constructor(
    public name: string,
    public email: string,
    public password: string
  ) {}
  async register() {
    let route = `auth/register`;
    let body = { name: this.name, email: this.email, password: this.password };
    let data = useFetch.post(route, body);
    return data;
  }
  async login() {
    let route = `auth/login`;
    let body = {
      email: this.email,
      password: this.password,
    };
    let data = useFetch.post(route, body);
    return data;
  }
  async me() {}
}

export default Auth;
