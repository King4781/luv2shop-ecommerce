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

  constructor(private orderHistoryService:OrderHistoryService) { }

  ngOnInit(): void {
    this.handleOrderHistory();
  }

  handleOrderHistory() {
    let email = "";
    let value = sessionStorage.getItem("userEmail");

    if (value != null) email = JSON.parse(value);

    this.orderHistoryService.getOrderHistory(email).subscribe(orders => {
      this.orders = orders;
    })
  }

}
