import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { IUser } from '../../../models/users';
import { ServerError } from 'src/app/models/error';
import { UserService } from '../../../services/user/user.service';
import { Router } from '@angular/router';
import { ConfigService } from 'src/app/services/config/config.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  login: string = '';
  psw: string = '';
  repeatPassword: string = '';
  cardNumber: string = '';
  email: string = '';
  isRemember: boolean = false;
  isShowCardNumber: boolean = false;

  constructor(
    private messageService: MessageService,
    private http: HttpClient,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isShowCardNumber = ConfigService.config.useUserCard;
  }

  ngOnDestroy(): void {}

   onAuth(): void {
    if (this.psw !== this.repeatPassword) {
      this.messageService.add({ severity: 'error', summary: 'Пароли не совпадают' });
      return;
    }

    const user: IUser = {
      login: this.login,
      psw: this.psw,
      cardNumber: this.cardNumber,
      email: this.email
    };

    this.http.post<{ access_token: string; id: string }>('http://localhost:3000/users/', user).subscribe(
      (data) => {
        user.id = data.id;
        this.userService.setUser(user);
        this.userService.setToken(data.access_token);
        this.userService.setToStore(data.access_token);
        this.messageService.add({ severity: 'success', summary: 'Регистрация прошла успешно' });
        this.router.navigate(['tickets', 'ticket-list']);
      },
      (err: HttpErrorResponse) => {
        const serverError = err.error as ServerError;
        this.messageService.add({
          severity: 'warn',
          summary: serverError?.errorText || 'Ошибка регистрации'
        });
      }
    );
  }
}