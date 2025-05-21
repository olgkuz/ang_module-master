import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { IUser } from '../../../models/users';
import { ServerError } from 'src/app/models/error';
import { UserService } from '../../../services/user/user.service';

@Component({
  selector: 'app-authorization',
  templateUrl: './authorization.component.html',
  styleUrls: ['./authorization.component.scss'],
})
export class AuthorizationComponent implements OnInit {
  login = '';
  psw = '';
  cardNumber = '';
  isRememberMe = false;
  isHaveCard = false;

  constructor(
    private http: HttpClient,
    private userService: UserService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  onAuth(ev: Event): void {
    const authUser: IUser = {
      login: this.login,
      psw: this.psw,
      cardNumber: this.cardNumber
    };

    this.http.post<{ access_token: string; id: string }>(
      `http://localhost:3000/users/login`,
      authUser
    ).subscribe({
      next: (data) => {
        authUser.id = data.id;

        this.userService.setUser(authUser);
        this.userService.setToken(data.access_token);
        this.userService.setToStore(data.access_token);

        this.messageService.add({ severity: 'success', summary: 'Вы успешно авторизованы!' });
        this.router.navigate(['tickets', 'ticket-list']);
      },
      error: (err: HttpErrorResponse) => {
        const serverError = err.error as ServerError;
        this.messageService.add({
          severity: 'warn',
          summary: serverError?.errorText || 'Ошибка получения токена!'
        });
      }
    });
  }
}
 