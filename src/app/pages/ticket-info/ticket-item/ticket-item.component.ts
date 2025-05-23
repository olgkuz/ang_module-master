import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { TicketStorageService } from "../../../services/ticket-storage/ticket-storage.service";
import { INearestTour, ITour, ITourLocation } from "../../../models/tours";
import { IUser } from "../../../models/users";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "../../../services/auth/auth.service";
import { forkJoin, fromEvent, Subscription } from "rxjs";
import { TicketService } from "../../../services/ticket/ticket.service";
import { IOrder } from 'src/app/models/order';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-ticket-item',
  templateUrl: './ticket-item.component.html',
  styleUrls: ['./ticket-item.component.scss']
})
export class TicketItemComponent implements OnInit {
  ticket: ITour;
  tourId: string;
  isNotFound: boolean = false;

  user: IUser;
  userForm: FormGroup;

  nearestTours: INearestTour[] = [];
  tourLocations: ITourLocation[] = [];
  ticketSearchValue: string = '';
  @ViewChild('ticketSearch') ticketSearch: ElementRef;
  private ticketSearchSubsc: Subscription;
  private ticketRestSub: Subscription;
  searchTypes = [1, 2, 3];

  constructor(
    private route: ActivatedRoute,
    private ticketStorage: TicketStorageService,
    private authService: AuthService,
    private ticketService: TicketService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const routeIdParam = this.route.snapshot.paramMap.get('id');
    const queryIdParam = this.route.snapshot.queryParamMap.get('id');
    const paramId = routeIdParam || queryIdParam;
    if (paramId) {
      this.tourId = paramId;
      this.getTicket(this.tourId);
    }

    this.user = this.userService.getUser();

    this.userForm = new FormGroup({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', [Validators.required, Validators.minLength(5)]),
      cardNumber: new FormControl(''),
      birthday: new FormControl(''),
      age: new FormControl(22),
      citizenship: new FormControl(''),
    });

    forkJoin([
      this.ticketService.getNearestTours(),
      this.ticketService.getTourLocations()
    ]).subscribe(([tours, locations]) => {
      this.tourLocations = locations;
      this.nearestTours = this.ticketService.transformData(tours, locations);
    });
  }

  getTicket(id: string): void {
    this.ticketStorage.fetchTickets(true).subscribe((tickets) => {
      const found = tickets.find(t => t.id === id);
      if (found) {
        this.ticket = found;
      } else {
        this.isNotFound = true;
      }
    });
  }

  ngAfterViewInit(): void {
    if (!this.ticketSearch) return;
    const fromEventObserver = fromEvent(this.ticketSearch.nativeElement, 'keyup');
    this.ticketSearchSubsc = fromEventObserver.subscribe(() => this.initSearchTour());
  }

  ngOnDestroy(): void {
    this.ticketSearchSubsc?.unsubscribe();
    this.ticketRestSub?.unsubscribe();
  }

  getTourCountry(tour: INearestTour): string {
    return this.tourLocations.find(({ id }) => tour.locationId === id)?.name || '-';
  }

  selectDate(ev: Date | PointerEvent): void {
    const selected = ev instanceof PointerEvent ? undefined : ev;
    this.userForm.patchValue({ birthday: selected });
  }

  initTour(): void {
    const userData = this.userForm.getRawValue();

    const postObj: IOrder = {
      
      tourId: postData._id,
      orderPerson:userData
    };

    this.ticketService.sendTourData(postObj).subscribe({
      next: () => console.log('Заявка отправлена'),
      error: () => console.log('Ошибка отправки заявки')
    });
  }

  initSearchTour(): void {
    const type = Math.floor(Math.random() * this.searchTypes.length);
    this.ticketRestSub?.unsubscribe();
    this.ticketRestSub = this.ticketService.getRandomNearestEvent(type).subscribe((data: any) => {
      this.nearestTours = this.ticketService.transformData([data], this.tourLocations);
    });
  }
}
