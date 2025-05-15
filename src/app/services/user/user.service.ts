import { Injectable } from '@angular/core';
import { IUser } from '../../models/users';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private token: string | null = null;
  private user: IUser | null = null;

  constructor() {
    console.log('user service init');
  }

  getUser(): IUser | null {
    return this.user;
  }

  setUser(user: IUser): void {
    this.user = user;
  }

  setToken(token: string): void {
    this.token = token;
  }

  getToken(): string | null {
    return this.token;
  }

  setToStore(token: string): void {
    window.localStorage.setItem('userToken', token);
  }

  getFromStore(): string | null {
    return window.localStorage.getItem('userToken');
  }

  getAllToken(): string | null {
    return this.token || this.getFromStore();
  }

  removeUser(): void {
    this.user = null;
    this.token = null;
    window.localStorage.removeItem('userToken');
  }

  updateUser(user: IUser): void {
    this.user = user;
  }
  setUserToStore(user: IUser): void {
  window.localStorage.setItem('userData', JSON.stringify(user));
}

getUserFromStore(): IUser | null {
  const stored = window.localStorage.getItem('userData');
  return stored ? JSON.parse(stored) : null;
}
}

