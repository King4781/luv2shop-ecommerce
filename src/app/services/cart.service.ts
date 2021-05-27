import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cartItems: CartItem[] = [];
  totalPrice: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  totalQuantity: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  storage: Storage = localStorage;
  private static EXPIRY_TIME: number = 60 * 60 * 24 * 1000;

  constructor() {
    const cartItems = this.getCartItemsWithExpiry('cartItems');
    if (cartItems != null) {
      this.cartItems = cartItems;
      this.computeCartTotals();
    }
  }

  persistCartItemsWithExpiry(ttl: number) {
    const now = new Date();

    const item = {
      value: this.cartItems,
      expiry: now.getTime() + ttl,
    };
    this.storage.setItem('cartItems', JSON.stringify(item));
  }

  getCartItemsWithExpiry(key: string) {
    const itemStr = localStorage.getItem(key);

    if (!itemStr) {
      return null;
    }
    const item = JSON.parse(itemStr);
    const now = new Date();

    if (now.getTime() > item.expiry) {
      localStorage.removeItem(key);
      return null;
    }

    return item.value;
  }

  resetCart() {
    this.cartItems = [];
    this.totalPrice.next(0);
    this.totalQuantity.next(0);
    this.storage.removeItem('cartItems');
  }

  addToCart(cartItem: CartItem) {
    let alreadyExistInCart: boolean = false;
    let existingCartItem: CartItem | undefined = undefined;

    if (this.cartItems.length > 0) {
      existingCartItem = this.cartItems.find((item) => item.id === cartItem.id);

      alreadyExistInCart = existingCartItem !== undefined;
    }

    if (alreadyExistInCart) {
      ++existingCartItem!.quantity;
    } else {
      this.cartItems.push(cartItem);
    }

    this.computeCartTotals();
  }

  computeCartTotals() {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for (let cartItem of this.cartItems) {
      totalPriceValue += cartItem.quantity * cartItem.unitPrice;
      totalQuantityValue += cartItem.quantity;
    }

    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);
    this.persistCartItemsWithExpiry(CartService.EXPIRY_TIME);
  }

  logCartDetails(totalPriceValue: number, totalQuantityValue: number) {
    console.log('Contents of Cart');

    for (let cartItem of this.cartItems) {
      const subTotal: number = cartItem.quantity * cartItem.unitPrice;
      console.log(
        `name: ${cartItem.name} quantity: ${cartItem.quantity} unitPrice: ${cartItem.unitPrice} subTotal: ${subTotal}`
      );
      console.log('-------------------------');
    }

    console.log(
      `totalPrice: ${totalPriceValue.toFixed(
        2
      )} totalQuantity: ${totalQuantityValue}`
    );
  }

  decrementQuantity(cartItem: CartItem) {
    --cartItem.quantity;

    if (cartItem.quantity === 0) {
      this.remove(cartItem);
    } else {
      this.computeCartTotals();
    }
  }

  remove(cartItem: CartItem) {
    const index: number = this.cartItems.findIndex(
      (currCartItem) => currCartItem.id === cartItem.id
    );

    if (index > -1) {
      this.cartItems.splice(index, 1);
      this.computeCartTotals();
    }
  }
}
