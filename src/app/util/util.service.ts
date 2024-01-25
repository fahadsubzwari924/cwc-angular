import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UtilService {
  setValueInLocalStorage(dataKey: string, value: any): void {
    localStorage.setItem(dataKey, value);
  }

  getFromLocalStorage(dataKey: string): any {
    const data = JSON.parse(localStorage.getItem(dataKey) as string);
    return data;
  }
}
