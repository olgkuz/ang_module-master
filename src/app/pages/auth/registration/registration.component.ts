import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AuthService } from "../../../services/auth/auth.service";
import { IUser } from "../../../models/users";
import { ConfigService } from "../../../services/config/config.service";
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ServerError } from 'src/app/models/error';

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
  saveUserInStore: any;

  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private http: HttpClient  
  ) {}

  ngOnInit(): void {
    this.isShowCardNumber = ConfigService.config.useUserCard;
  }

  ngOnDestroy(): void {}

  onAuth(): void {
    if (this.psw !== this.repeatPassword) {
      this.messageService.add({ severity: 'error', summary: 'Passwords are not the same' });
      return;
    }

    const user: IUser = {
      login: this.login,
      psw: this.psw,
      cardNumber: this.cardNumber,
      email: this.email
    };

    this.http.post<IUser>('http://localhost:3000/users/', user).subscribe(
      (data: IUser) => { 
        if (this.saveUserInStore) {
          const objUserJsonStr = JSON.stringify(user);
          window.localStorage.setItem('user_' + user.login, objUserJsonStr);
        }
        this.messageService.add({ severity: 'success', summary: 'Регистрация прошла успешно' });
      },
      (err:HttpErrorResponse) => {
        const serverError = <ServerError>err.error
        this.messageService.add({ severity: 'warn', summary: serverError.errorText });
      }
    );
  }
}