import { Component, OnInit } from '@angular/core';
import {IMenuType} from "../../models/menu";

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.scss']
})
export class TicketsComponent implements OnInit {
  selectedType: IMenuType

  constructor() { }

  ngOnInit(): void {
    console.log('TicketsComponent initialized');
  }

  updateSelectedType(ev: IMenuType): void {
    this.selectedType = ev;
  }

}
