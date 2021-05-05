import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderHistory } from '../common/order-history';

@Injectable({
  providedIn: 'root'
})
export class OrderHistoryService {

  private baseUrl:string = "http://localhost:8080/api/orders";
  private netlifyOrdersUrl:string = ".netlify/functions/netlify-auth";

  constructor(private httpClient: HttpClient) { }

  getOrderHistory(email:string): Observable<OrderHistory[]> {
    const ordersUrl = `${this.baseUrl}/findByEmail?email=${email}`;
    return this.httpClient.get<OrderHistory[]>(ordersUrl);
  }

  getOrders(): Observable<GetResponseOrderHistory> {
    return this.httpClient.get<GetResponseOrderHistory>(this.netlifyOrdersUrl);
  }
}

interface GetResponseOrderHistory {
  _embedded: {
    orders: OrderHistory[]
  }
}