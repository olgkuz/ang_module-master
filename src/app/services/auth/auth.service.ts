import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject, tap } from 'rxjs';
import { IUser } from '../../models/users';
import { UserService } from '../user/user.service';
import { UserAccessService } from '../user-access/user-access.service';
import { UserRules } from '../../shared/mock/rules';

export const LOCAL_STORAGE_NAME = 'currentUser';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<IUser | null>(null);
  user$ = this.userSubject.asObservable();
  private userBehaviorSubject = new BehaviorSubject(null);
  userBehavior$ = this.userBehaviorSubject.asObservable();
  private userStorage: IUser[] = [];
  private userBasketSubject = new Subject();
  basket$ = this.userBasketSubject.asObservable();
    private currentUser: IUser | null = null;
  constructor(
    private http: HttpClient,
    private router: Router,
    private userService: UserService,
    private accessService: UserAccessService
  ) {
    const storedUser = localStorage.getItem(LOCAL_STORAGE_NAME);
    if (storedUser) {
      const user: IUser = JSON.parse(storedUser);
      this.userSubject.next(user);
      this.userService.setUser(user);
    }
  }
  initUserToSubject(): void {
    this.userSubject.next(this.currentUser);
    this.userBehaviorSubject.next(this.currentUser);
  }

  addBasketToSubject(): void {
    this.userBasketSubject.next('basket' +  Math.random());
  }

 

  authUser(login: string, psw: string, isRememberMe: boolean): Observable<{ access_token: string, id: string }> {
    const user: IUser = { login, psw };
    return this.http.post<{ access_token: string, id: string }>(`http://localhost:3000/users/${login}`, user).pipe(
      tap((data) => {
        const userWithId: IUser = { ...user, id: data.id };
        this.userService.setUser(userWithId);
        this.userService.setToken(data.access_token);
        this.userService.setToStore(data.access_token);

        if (isRememberMe) {
          localStorage.setItem(LOCAL_STORAGE_NAME, JSON.stringify(userWithId));
        }

        this.userSubject.next(userWithId);
        this.accessService.initAccess(UserRules);
      })
    );
  }

  addUser(user: IUser, isRememberMe?: boolean): Observable<IUser> {
    return this.http.post<IUser>('http://localhost:3000/users', user).pipe(
      tap((newUser) => {
        this.userService.setUser(newUser);
        if (isRememberMe) {
          localStorage.setItem(LOCAL_STORAGE_NAME, JSON.stringify(newUser));
        }
        this.userSubject.next(newUser);
        this.accessService.initAccess(UserRules);
        this.router.navigate(['tickets', 'ticket-list']);
      })
    );
  }

  logout(): void {
    this.userService.removeUser();
    localStorage.removeItem(LOCAL_STORAGE_NAME);
    this.userSubject.next(null);
    this.router.navigate(['auth']);
  }
   changePassword(password: string) {
    if (!this.currentUser) {
      return
    }
    this.currentUser.psw = password;
    const dbUser = this.userStorage.find(({login}) => login === this.currentUser?.login)!;
    dbUser.psw = password
  }
  get isAuthenticated(): boolean {
    return !!this.userService.getUser() || !!localStorage.getItem(LOCAL_STORAGE_NAME);
  }

  get user(): IUser | null {
    return this.userService.getUser();
  }

  get token(): string | null {
    return this.userService.getAllToken();
  }
}
