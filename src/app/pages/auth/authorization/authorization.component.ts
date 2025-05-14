import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MessageService } from "primeng/api";
import { Router } from '@angular/router';
import { IUser } from '../../../models/users'; 
import { AuthService } from "../../../services/auth/auth.service"; 
import { ServerError } from 'src/app/models/error';

@Component({
  selector: 'app-authorization',
  templateUrl: './authorization.component.html',
  styleUrls: ['./authorization.component.scss'],
})
export class AuthorizationComponent implements OnInit {
  login: string = '';
  psw: string = ''; 
  cardNumber: string = '';
  isRememberMe: boolean = false;
  isHaveCard: boolean = false;
 

  constructor(
    private http: HttpClient,
    private authService: AuthService,        
    private messageService: MessageService,
    private router: Router
  ) {}
  

  ngOnInit(): void {}

  ngOnDestroy(): void {}

  vipStatusSelected(): void{}

 onAuth(ev: Event): void {
  const authUser: IUser = {
    psw: this.psw,
    login: this.login,
    cardNumber: this.cardNumber
  };

 this.http.post<{ access_token: string,id:string }>(
  'http://localhost:3000/users/'+authUser.login,authUser).subscribe.
   authUser.id = data.id;
      this.userService.setUser(authUser);
      const token: string = data.access_token;
      this.userService.setToken(token);
      this.userService.setToStore(token);
      this.router.navigate(['tickets', 'ticket-list']);
          
        }, (err:HttpErrorResponse) => {
          const serverError = <ServerError>err.error;
          this.messageService.add({ severity: 'warn', summary: 'Ошибка авторизации!' });
        
      });
    
 