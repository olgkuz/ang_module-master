import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MessageService } from "primeng/api";
import { Router } from '@angular/router';
import { IUser } from '../../../models/users'; 
import { AuthService } from "../../../services/auth/auth.service"; // <<< добавили сюда

@Component({
  selector: 'app-authorization',
  templateUrl: './authorization.component.html',
  styleUrls: ['./authorization.component.scss'],
})
export class AuthorizationComponent implements OnInit {
  login: string = '';
  psw: string = ''; // вместо password
  cardNumber: string = '';
  isRememberMe: boolean = false;
  isHaveCard: boolean = false;

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private router: Router,
    private authService: AuthService  // <<< добавили сюда
  ) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {}

  onAuth(): void {
    const authUser: IUser = {
      login: this.login,
      psw: this.psw,
    };

    this.http.post<boolean>('http://localhost:3000/users/' + authUser.login, authUser).subscribe({
      next: (data) => {
        if (data) {
          // сохраняем в сервис
          this.authService.setUser(authUser);

          if (this.isRememberMe) {
            const userJsonStr = JSON.stringify(authUser);
            localStorage.setItem('user_' + authUser.login, userJsonStr);
          }

          this.messageService.add({ severity: 'success', summary: 'Вы успешно авторизованы!' });
          this.router.navigate(['tickets/tickets-list']); 
        } else {
          this.messageService.add({ severity: 'error', summary: 'Неверный логин или пароль!' });
        }
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Ошибка авторизации!' });
      }
    });
  }
}