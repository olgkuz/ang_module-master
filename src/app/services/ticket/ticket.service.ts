import {Injectable} from '@angular/core';
import {TicketRestService} from "../ticket-rest/ticket-rest.service";
import {BehaviorSubject, map, Observable, Subject} from "rxjs";
import {INearestTour, ITour, ITourLocation, ITourTypeSelect} from "../../models/tours";

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  
  private ticketSubject = new Subject<ITourTypeSelect>()
  readonly $ticketType = this.ticketSubject.asObservable()

  private ticketUpdateSubject = new Subject<ITour[]>();
  readonly ticketUpdateSubject$ = this.ticketUpdateSubject.asObservable();

  constructor(private ticketServiceRest: TicketRestService) {
  }

  getTickets(): Observable<ITour[]> {
    return this.ticketServiceRest.getTickets().pipe(map((items) => {
      return items.concat(items.filter(({type}) => type === 'single'));
    }));
  }

  getTicketTypeObservable() {
    return this.ticketSubject.asObservable();
  }

  updateTour(type: ITourTypeSelect) {
    this.ticketSubject.next(type);
  }

  updateTicketList(data:ITour[]){
    this.ticketUpdateSubject.next(data);
  }

  getError() {
    return this.ticketServiceRest.getRestError();
  }

  getNearestTours() {
    return this.ticketServiceRest.getNearestTickets();
  }

  getTourLocations() {
    return this.ticketServiceRest.getLocationList();
  }

  getRandomNearestEvent(type: number) {
    return this.ticketServiceRest.getRandomNearestEvent(type);
  }

  transformData(data: INearestTour[], tourLocations: ITourLocation[]) {
    const newTicketData: INearestTour[] = [];
    data.forEach((e) => {
      newTicketData.push({
        ...e,
        region: tourLocations.find((region) => e.locationId === region.id)
      })
    });
    return newTicketData;
  }

  sendTourData(data: any) {
    return this.ticketServiceRest.sendTourData(data)
  }

  getTicketById(id:string):Observable <ITour>  {
   return this.ticketServiceRest.getTicketById(id)
  }

  createTour(formParams: FormData) {
  return this.ticketServiceRest.createTour(formParams);
}

}
