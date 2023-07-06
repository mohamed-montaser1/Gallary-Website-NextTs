import useFetch from "@/hooks/useFetch";
import axios from "axios";

class Auth {
  constructor(
    public email: string,
    public password: string,
    public name?: string
  ) {}
  async register() {
    let route = `auth/register`;
    let body = { name: this.name, email: this.email, password: this.password };
    console.log("body", body);
    // let data = await useFetch.post(route, body);
    let { data } = await axios.post("/api/auth/register", body);
    console.log(data);
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
