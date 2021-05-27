import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CustomerInfo } from '../common/customer-info';
import { Purchase } from '../common/purchase';

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  private purchaseUrl: string = environment.base_url + '/checkout/purchase';

  constructor(private httpClient: HttpClient) {}

  placeOrder(purchase: Purchase): Observable<any> {
    return this.httpClient.post<Purchase>(this.purchaseUrl, purchase);
  }

  createCheckOutSession(
    purchase: Purchase,
    url: string
  ): Observable<GetStripeId> {
    return this.httpClient.post<GetStripeId>(url, purchase);
  }

  getCustomerInfo(): Observable<CustomerInfo> {
    return this.httpClient.get<CustomerInfo>(this.purchaseUrl);
  }
}

interface GetStripeId {
  id: string;
}
