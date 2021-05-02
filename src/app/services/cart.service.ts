import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];
  totalPrice: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  totalQuantity: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  storage: Storage = localStorage;

  constructor() {

    let savedCartItems: string|null = this.storage.getItem("cartItems");
    if (savedCartItems != null) {
      let data = JSON.parse(savedCartItems);

      this.cartItems = data;
      this.computeCartTotals();
    }

  }

  persistCartItems() {
    this.storage.setItem("cartItems", JSON.stringify(this.cartItems));
  }

  addToCart(cartItem: CartItem) {
    let alreadyExistInCart: boolean = false;
    let existingCartItem: CartItem|undefined = undefined;

    if (this.cartItems.length > 0) {
      existingCartItem = this.cartItems.find(item => item.id === cartItem.id);

      alreadyExistInCart = (existingCartItem !== undefined);
    }

    if (alreadyExistInCart) {
      ++existingCartItem!.quantity;
    }
    else {
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
    this.persistCartItems();
  }

  logCartDetails(totalPriceValue: number, totalQuantityValue: number) {

    console.log("Contents of Cart");

    for (let cartItem of this.cartItems) {
      const subTotal: number = cartItem.quantity * cartItem.unitPrice;
      console.log(`name: ${cartItem.name} quantity: ${cartItem.quantity} unitPrice: ${cartItem.unitPrice} subTotal: ${subTotal}`);
      console.log("-------------------------")
    }

    console.log(`totalPrice: ${totalPriceValue.toFixed(2)} totalQuantity: ${totalQuantityValue}`);
  }

  decrementQuantity(cartItem: CartItem) {
    --cartItem.quantity;

    if (cartItem.quantity === 0) {
      this.remove(cartItem);
    }
    else {
      this.computeCartTotals();
    }
  }

  remove(cartItem: CartItem) {
    const index: number = this.cartItems.findIndex(currCartItem => currCartItem.id === cartItem.id);

    if (index > -1) {
      this.cartItems.splice(index, 1);
      this.computeCartTotals();
    }
  }
}
