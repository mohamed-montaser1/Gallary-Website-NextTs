export default class useFetch {
  static async get<T, U>(
    route: string,
    query: string | null | undefined,
    Authorization: U | null
  ) {
    let res;
    switch (true) {
      case !query && !Authorization:
        res = await fetch(`/api/${route}`, { method: "GET" });
        break;
      case query && !Authorization:
        res = await fetch(`/api/${route}?${query}`, { method: "GET" });
        break;
      case !query && Authorization !== "":
        res = await fetch(`/api/${route}`, {
          method: "GET",
          headers: {
            Authorization: Authorization as string,
          },
        });
        break;
      case query && Authorization !== "":
        res = await fetch(`/api/${route}?${query}`, {
          method: "GET",
          headers: { Authorization: Authorization as string },
        });
        break;
      default:
        res = await fetch(`/api/${route}`, { method: "GET" });
        break;
    }
    let data: T = await res.json();
    return data;
  }
  static async post(route: string, body?: any, Authorization?: string) {
    let res;
    if (body) {
      res = await fetch(`/api/${route}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: Authorization ? Authorization : "",
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
  static async put(route: string, body: any, headers: any) {
    let res = await fetch(`/api/${route}`, {
      method: "PUT",
      body: JSON.stringify(body),
      headers,
    });
    let data = await res.json();
    return data;
  }
}
