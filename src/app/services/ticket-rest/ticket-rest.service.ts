import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { INearestTour, ITour, ITourLocation } from "../../models/tours";
import { IOrder } from 'src/app/models/order';

@Injectable({
  providedIn: 'root'
})
export class TicketRestService {

  private apiTour = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getTickets(): Observable<ITour[]> {
    return this.http.get<ITour[]>(`${this.apiTour}/tours`);
  }

  generateTours(): Observable<ITour[]> {
    return this.http.post<ITour[]>(`${this.apiTour}/tours`, {});
  }

  deleteAllTours(): Observable<any> {
    return this.http.delete(`${this.apiTour}/tours`);
  }

  getRestError(): Observable<any> {
    return this.http.get<any>(`${this.apiTour}/tours/notFound`);
  }

  getNearestTickets(): Observable<INearestTour[]> {
    return this.http.get<INearestTour[]>(`${this.apiTour}/nearestTours`);
  }

  getLocationList(): Observable<ITourLocation[]> {
    return this.http.get<ITourLocation[]>(`${this.apiTour}/locations`);
  }

  getRandomNearestEvent(type: number) {
    return this.http.get(`/assets/mocks/nearestTours${type + 1}.json`);
  }

  sendTourData(data: IOrder): Observable<any> {
    return this.http.post('http://localhost:3000/order/', data);
  }
  getTicketById(id:string): Observable<ITour> {
    return this.http.get("http://localhost:3000/tours/"+ id)
  }
  createTour(body:any):Observable<any> {
    return this.http.post("http://localhost:3000/tour-iteam/",body{headers:{}})
  }
}
