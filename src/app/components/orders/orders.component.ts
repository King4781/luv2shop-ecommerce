import { Component, OnInit } from '@angular/core';
import { OrderHistory } from 'src/app/common/order-history';
import { OrderHistoryService } from 'src/app/services/order-history.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {

  orders: Array<OrderHistory> = [];
  storage: Storage = sessionStorage;
  errorMsg: string = "";
  loading:boolean = false;
  

  constructor(private orderHistoryService:OrderHistoryService) { }

  ngOnInit(): void {
    this.loading = true;
    this.handleOrderHistory();
    this.orderHistoryService.errorMsg.subscribe(errMessage => {
      this.errorMsg = errMessage;
      this.loading = false;
    })
  }

  handleOrderHistory() {
    this.orderHistoryService.getOrderHistory().subscribe(orders => {
      this.orders = orders;
      this.loading = false;
    })
  }

}
