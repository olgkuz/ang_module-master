import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MessageService } from "primeng/api";
import { Router } from '@angular/router';
import { IUser } from '../../../models/users'; 
import { AuthService } from "../../../services/auth/auth.service"; 

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
    private authService: AuthService,        
    private messageService: MessageService,
    private router: Router
  ) {}
  

  ngOnInit(): void {}

  ngOnDestroy(): void {}

  onAuth(): void {
    this.authService.authUser(this.login, this.psw, this.isRememberMe).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Вы успешно авторизованы!' });
  
        
        setTimeout(() => {
          this.router.navigate(['tickets/ticket-list']);
        }, 0);
      },
      error: () => {
        this.messageService.add({ severity: 'warn', summary: 'Ошибка авторизации!' });
      }
    });
  }
}