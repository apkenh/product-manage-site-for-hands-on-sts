import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {
  constructor() {}

  static getItem<T>(key: string, t: T): T {
    return JSON.parse(sessionStorage.getItem(key)) as T;
  }

  static removeItem(key: string) {
    sessionStorage.removeItem(key);
  }

  static setItem<T>(key: string, t: T): void {
    sessionStorage.setItem(key, JSON.stringify(t));
  }
}
