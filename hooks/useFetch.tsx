export default class useFetch {
  static async get(route: string) {
    let res = await fetch(`/api/${route}`, { method: "GET" });
    let data = await res.json();
    return data;
  }
  static async post(route: string, body?: any) {
    let res;
    if (body) {
      res = await fetch(`/api/${route}`, {
        method: "POST",
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
