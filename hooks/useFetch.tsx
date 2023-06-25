export default class useFetch {
  static async get<T>(route: string) {
    let res = await fetch(`/api/${route}`, { method: "GET" });
    let data: T = await res.json();
    return data;
  }
  static async post(route: string, body?: any) {
    let res;
    if (body) {
      res = await fetch(`/api/${route}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
    } else {
      res = await fetch(`/api/${route}`, {
        method: "POST",
      });
    }
    let data = await res.json();
    return data;
  }
}
