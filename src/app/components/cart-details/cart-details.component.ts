import { Component, OnInit } from '@angular/core';
import { CartItem } from 'src/app/common/cart-item';
import { OrderItem } from 'src/app/common/order-item';
import { Purchase } from 'src/app/common/purchase';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';
import { StripeService } from 'src/app/services/stripe-service';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.css'],
})
export class CartDetailsComponent implements OnInit {
  cartItems: CartItem[] = [];
  totalPrice: number = 0;
  totalQuantity: number = 0;
  isAuthenticated: boolean = false;
  checkoutFailed: boolean = false;
  loading: boolean = false;

  private baseUrl: string = 'http://localhost:8080/api';
  private guestPurchaseUrl: string =
    this.baseUrl + '/checkout/create-checkout-session';

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private stripeService: StripeService
  ) {}

  ngOnInit(): void {
    this.setCheckoutFailed();
    this.isAuthenticated = this.authService.isAuthenticated.getValue();

    this.stripeService.loading.subscribe((loading) => {
      this.loading = loading;
    });

    this.authService.isAuthenticated.subscribe((isAuthenticated) => {
      this.isAuthenticated = isAuthenticated;
    });

    this.listCartDetails();
  }

  checkout() {
    const purchase: Purchase = new Purchase();
    let orderItems: OrderItem[] = this.cartService.cartItems.map(
      (item) => new OrderItem(item)
    );
    purchase.orderItems = orderItems;

    this.stripeService.checkout(purchase, this.guestPurchaseUrl);
  }

  setCheckoutFailed() {
    let value = this.stripeService.getUrlParameter('success');

    if (value && value == 'false') {
      this.checkoutFailed = true;

      setTimeout(() => {
        this.checkoutFailed = false;
      }, 5000);
    }
  }

  listCartDetails() {
    this.cartItems = this.cartService.cartItems;

    this.cartService.totalPrice.subscribe((data) => (this.totalPrice = data));

    this.cartService.totalQuantity.subscribe(
      (data) => (this.totalQuantity = data)
    );

    this.cartService.computeCartTotals();
  }

  incrementQuantity(cartItem: CartItem) {
    this.cartService.addToCart(cartItem);
  }

  decrementQuantity(cartItem: CartItem) {
    this.cartService.decrementQuantity(cartItem);
  }

  remove(cartItem: CartItem) {
    this.cartService.remove(cartItem);
  }
}
