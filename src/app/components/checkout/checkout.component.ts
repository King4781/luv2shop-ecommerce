import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Country } from 'src/app/common/country';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { Purchase } from 'src/app/common/purchase';
import { State } from 'src/app/common/state';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { Luv2ShopFormService } from 'src/app/services/luv2-shop-form.service';
import { StripeService } from 'src/app/services/stripe-service';
import { Luv2ShopValidators } from 'src/app/validators/luv2-shop-validators';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  checkoutFormGroup!: FormGroup;
  totalPrice: number = 0;
  totalQuantity: number = 0;
  countries: Country[] = [];
  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];
  storage: Storage = localStorage;

  isAuthenticated: boolean = false;
  loading: boolean = false;

  private baseUrl: string = 'http://localhost:8080/api';
  private purchaseUrl: string = this.baseUrl + '/checkout/purchase';

  constructor(
    private formBuilder: FormBuilder,
    private cartService: CartService,
    private luv2ShopFormService: Luv2ShopFormService,
    private checkoutService: CheckoutService,
    private authService: AuthService,
    private stripeService: StripeService
  ) {}

  ngOnInit(): void {
    this.isAuthenticated = this.authService.isAuthenticated.getValue();

    this.stripeService.loading.subscribe((loading) => {
      this.loading = loading;
    });

    this.authService.isAuthenticated.subscribe((isAuthenticated) => {
      this.isAuthenticated = isAuthenticated;
      if (isAuthenticated) {
        this.getCustomerInfo();
      }
    });

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          Luv2ShopValidators.notOnlyWhitespace,
          Luv2ShopValidators.notOnlyWhitespaceWithOneLetter,
        ]),
        lastName: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          Luv2ShopValidators.notOnlyWhitespace,
          Luv2ShopValidators.notOnlyWhitespaceWithOneLetter,
        ]),
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          Luv2ShopValidators.notOnlyWhitespace,
          Luv2ShopValidators.notOnlyWhitespaceWithOneLetter,
        ]),
        city: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          Luv2ShopValidators.notOnlyWhitespace,
          Luv2ShopValidators.notOnlyWhitespaceWithOneLetter,
        ]),
        state: new FormControl('', [
          Validators.required,
          Luv2ShopValidators.notOnlyWhitespace,
        ]),
        country: new FormControl('', [
          Validators.required,
          Luv2ShopValidators.notOnlyWhitespace,
        ]),
        zipCode: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          Luv2ShopValidators.notOnlyWhitespace,
          Luv2ShopValidators.notOnlyWhitespaceWithOneLetter,
        ]),
      }),
      billingAddress: this.formBuilder.group({
        street: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          Luv2ShopValidators.notOnlyWhitespace,
          Luv2ShopValidators.notOnlyWhitespaceWithOneLetter,
        ]),
        city: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          Luv2ShopValidators.notOnlyWhitespace,
          Luv2ShopValidators.notOnlyWhitespaceWithOneLetter,
        ]),
        state: new FormControl('', [
          Validators.required,
          Luv2ShopValidators.notOnlyWhitespace,
        ]),
        country: new FormControl('', [
          Validators.required,
          Luv2ShopValidators.notOnlyWhitespace,
        ]),
        zipCode: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          Luv2ShopValidators.notOnlyWhitespace,
          Luv2ShopValidators.notOnlyWhitespaceWithOneLetter,
        ]),
      }),
    });

    const startMonth: number = new Date().getMonth() + 1;

    this.luv2ShopFormService.getCountries().subscribe((data) => {
      this.countries = data._embedded.countries;
    });

    this.setCartTotals();
  }

  setCartTotals() {
    this.cartService.totalPrice.subscribe(
      (totalPrice) => (this.totalPrice = totalPrice)
    );
    this.cartService.totalQuantity.subscribe(
      (totalQuantity) => (this.totalQuantity = totalQuantity)
    );
  }

  onSubmit() {
    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }

    const cartItems: CartItem[] = this.cartService.cartItems;

    let order: Order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    let orderItems: OrderItem[] = cartItems.map((item) => new OrderItem(item));

    let purchase: Purchase = new Purchase();

    purchase.customer = this.checkoutFormGroup.controls['customer'].value;

    purchase.shippingAddress = this.checkoutFormGroup.controls[
      'shippingAddress'
    ].value;
    const shippingState: State = JSON.parse(
      JSON.stringify(purchase.shippingAddress.state)
    );
    const shippingCountry: Country = JSON.parse(
      JSON.stringify(purchase.shippingAddress.country)
    );
    purchase.shippingAddress.state = shippingState.name;
    purchase.shippingAddress.country = shippingCountry.name;

    purchase.billingAddress = this.checkoutFormGroup.controls[
      'billingAddress'
    ].value;
    const billingState: State = JSON.parse(
      JSON.stringify(purchase.billingAddress.state)
    );
    const billingCountry: Country = JSON.parse(
      JSON.stringify(purchase.billingAddress.country)
    );
    purchase.billingAddress.state = billingState.name;
    purchase.billingAddress.country = billingCountry.name;

    purchase.order = order;
    purchase.orderItems = orderItems;

    this.stripeService.checkout(purchase, this.purchaseUrl);
  }

  handleMonthsAndYears() {
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');

    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(
      creditCardFormGroup?.value.expirationYear
    );

    let startMonth: number;

    if (currentYear === selectedYear) {
      startMonth = new Date().getMonth() + 1;
    } else {
      startMonth = 1;
    }
  }

  copyShippingAddressToBillingAddress(event: Event) {
    if (event.target !== null) {
      const checkBox: HTMLInputElement = event.target as HTMLInputElement;

      if (checkBox.checked) {
        this.checkoutFormGroup.controls.billingAddress.setValue(
          this.checkoutFormGroup.controls.shippingAddress.value
        );
        this.billingAddressStates = this.shippingAddressStates;
      } else {
        this.checkoutFormGroup.controls.billingAddress.reset();
        this.billingAddressStates = [];
      }
    }
  }

  get firstName() {
    return this.checkoutFormGroup.get('customer.firstName');
  }
  get lastName() {
    return this.checkoutFormGroup.get('customer.lastName');
  }

  get shippingAddressStreet() {
    return this.checkoutFormGroup.get('shippingAddress.street');
  }
  get shippingAddressCity() {
    return this.checkoutFormGroup.get('shippingAddress.city');
  }
  get shippingAddressState() {
    return this.checkoutFormGroup.get('shippingAddress.state');
  }
  get shippingAddressCountry() {
    return this.checkoutFormGroup.get('shippingAddress.country');
  }
  get shippingAddressZipCode() {
    return this.checkoutFormGroup.get('shippingAddress.zipCode');
  }

  get billingAddressStreet() {
    return this.checkoutFormGroup.get('billingAddress.street');
  }
  get billingAddressCity() {
    return this.checkoutFormGroup.get('billingAddress.city');
  }
  get billingAddressState() {
    return this.checkoutFormGroup.get('billingAddress.state');
  }
  get billingAddressCountry() {
    return this.checkoutFormGroup.get('billingAddress.country');
  }
  get billingAddressZipCode() {
    return this.checkoutFormGroup.get('billingAddress.zipCode');
  }

  get cardType() {
    return this.checkoutFormGroup.get('creditCard.cardType');
  }
  get nameOnCard() {
    return this.checkoutFormGroup.get('creditCard.nameOnCard');
  }
  get cardNumber() {
    return this.checkoutFormGroup.get('creditCard.cardNumber');
  }
  get securityCode() {
    return this.checkoutFormGroup.get('creditCard.securityCode');
  }
  get expirationMonth() {
    return this.checkoutFormGroup.get('creditCard.expirationMonth');
  }
  get expirationYear() {
    return this.checkoutFormGroup.get('creditCard.expirationYear');
  }

  getStates(formGroupName: string) {
    const formGroup = this.checkoutFormGroup.get(formGroupName);
    const countryCode = formGroup?.value.country.code;

    this.luv2ShopFormService.getStates(countryCode).subscribe((data) => {
      let states: State[] = data._embedded.states;

      if (formGroupName === 'shippingAddress') {
        this.shippingAddressStates = states;
      } else {
        this.billingAddressStates = states;
      }

      formGroup?.get('state')?.setValue(states[0]);
    });
  }

  getCustomerInfo() {
    this.checkoutService.getCustomerInfo().subscribe((customerInfo) => {
      this.checkoutFormGroup
        .get('customer')
        ?.get('firstName')
        ?.setValue(customerInfo.firstName);
      this.checkoutFormGroup
        .get('customer')
        ?.get('lastName')
        ?.setValue(customerInfo.lastName);

      this.checkoutFormGroup
        .get('shippingAddress')
        ?.get('street')
        ?.setValue(customerInfo.shippingAddress.street);
      this.checkoutFormGroup
        .get('shippingAddress')
        ?.get('city')
        ?.setValue(customerInfo.shippingAddress.city);
      this.checkoutFormGroup
        .get('shippingAddress')
        ?.get('zipCode')
        ?.setValue(customerInfo.shippingAddress.zipCode);

      this.checkoutFormGroup
        .get('billingAddress')
        ?.get('street')
        ?.setValue(customerInfo.billingAddress.street);
      this.checkoutFormGroup
        .get('billingAddress')
        ?.get('city')
        ?.setValue(customerInfo.billingAddress.city);
      this.checkoutFormGroup
        .get('billingAddress')
        ?.get('zipCode')
        ?.setValue(customerInfo.billingAddress.zipCode);
    });
  }
}
