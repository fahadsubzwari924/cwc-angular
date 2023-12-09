export class Utils {
  public static getItemFromLocalStorage(key: string) {
    return localStorage.getItem(key);
  }

  public static setItemFromToStorage(key: string, data: any): void {
    localStorage.setItem(key, data);
  }

  public static getItem(key: string) {
    return localStorage.getItem(key);
  }
}
