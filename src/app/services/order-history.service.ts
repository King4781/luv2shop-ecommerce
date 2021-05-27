import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { OrderHistory } from '../common/order-history';

@Injectable({
  providedIn: 'root',
})
export class OrderHistoryService {
  private ordersUrl: string = environment.API_URL + '/orders/findByEmail';
  errorMsg: Subject<string> = new Subject<string>();

  constructor(private httpClient: HttpClient) {}

  getOrderHistory(): Observable<OrderHistory[]> {
    return this.httpClient
      .get<OrderHistory[]>(this.ordersUrl)
      .pipe(catchError(this.handleError));
  }

  private handleError = (error: HttpErrorResponse) => {
    this.errorMsg.next(error.error.message);

    return throwError(error.error.message);
  };
}
