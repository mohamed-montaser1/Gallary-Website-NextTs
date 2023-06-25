export default class useStorage {
  static getItem(item: string) {
    if (process.browser) {
      return localStorage.getItem(item);
    }
  }
  static setItem(key: string, value: string) {
    if (process.browser) {
      return localStorage.setItem(key, value);
    }
  }
  static removeItem(key: string) {
    if (process.browser) {
      return localStorage.removeItem(key);
    }
  }
  static clear() {
    if (process.browser) {
      return localStorage.clear();
    }
  }
}
