import { Injectable } from '@angular/core';
import { IUser } from "../../models/users";
import { Router } from "@angular/router";
import { UserAccessService } from "../user-access/user-access.service";
import { UserRules } from "../../shared/mock/rules";
import { BehaviorSubject, Observable, Subject, tap } from "rxjs";
import { HttpClient } from '@angular/common/http';

export const LOCAL_STORAGE_NAME = 'currentUser';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new Subject<IUser | null>();
  user$ = this.userSubject.asObservable();

  private userBehaviorSubject = new BehaviorSubject<IUser | null>(null);
  userBehavior$ = this.userBehaviorSubject.asObservable();

  private currentUser: IUser | null = null;
  private userBasketSubject = new Subject<string>();
  basket$ = this.userBasketSubject.asObservable();

  constructor(
    private router: Router,
    private accessService: UserAccessService,
    private http: HttpClient,
  ) {
    const storedUser: IUser | null = JSON.parse(localStorage.getItem(LOCAL_STORAGE_NAME) || 'null');
    if (storedUser) {
      this.auth(storedUser);
    }
  }

  private auth(user: IUser, isRememberMe?: boolean): void {
    this.currentUser = user;
    this.accessService.initAccess(UserRules);

    if (isRememberMe) {
      localStorage.setItem(LOCAL_STORAGE_NAME, JSON.stringify(user));
    }

    this.userSubject.next(this.currentUser);
    this.userBehaviorSubject.next(this.currentUser);
  }

  initUserToSubject(): void {
    this.userSubject.next(this.currentUser);
    this.userBehaviorSubject.next(this.currentUser);
  }

  addBasketToSubject(): void {
    this.userBasketSubject.next('basket_' + Math.random());
  }

  setUser(user: IUser): void {
    this.currentUser = user;
  }

  get isAuthenticated(): boolean {
    return !!this.currentUser || !!localStorage.getItem(LOCAL_STORAGE_NAME);
  }

  get isUserInStore(): boolean {
    return !!localStorage.getItem(LOCAL_STORAGE_NAME);
  }

  get user(): IUser | null {
    return this.currentUser;
  }

  get token(): string | null {
    return this.isAuthenticated ? 'my-token' : null;
  }

  // 🔥 Авторизация через сервер
  authUser(login: string, psw: string, isRememberMe: boolean): Observable<boolean> {
    return this.http.post<boolean>(`http://localhost:3000/users/${login}`, { login, psw }).pipe(
      tap((isAuth) => {
        if (isAuth) {
          const user: IUser = { login, psw };
          this.auth(user, isRememberMe);
          this.router.navigate(['tickets/tickets-list']);
        }
      })
    );
  }

  // 🔥 Регистрация через сервер
  addUser(user: IUser, isRememberMe?: boolean): Observable<IUser> {
    return this.http.post<IUser>('http://localhost:3000/users', user).pipe(
      tap((newUser) => {
        this.auth(newUser, isRememberMe);
        this.router.navigate(['tickets/tickets-list']);
      })
    );
  }

  logout(): void {
    this.currentUser = null;
    localStorage.removeItem(LOCAL_STORAGE_NAME);
    this.router.navigate(['auth']);
  }

  changePassword(newPassword: string): void {
    if (!this.currentUser) {
      return;
    }
    this.currentUser.psw = newPassword; // исправил на psw
    localStorage.setItem(LOCAL_STORAGE_NAME, JSON.stringify(this.currentUser));
  }
}
