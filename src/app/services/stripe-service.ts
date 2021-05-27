import { Injectable } from '@angular/core';
import { loadStripe } from '@stripe/stripe-js';
import { BehaviorSubject } from 'rxjs';
import { STRIPE_KEY } from 'stripe_key';
import { Purchase } from '../common/purchase';
import { CheckoutService } from './checkout.service';

@Injectable({
  providedIn: 'root',
})
export class StripeService {
  private stripePromise = loadStripe(STRIPE_KEY);
  loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private checkoutService: CheckoutService) {}

  checkout(purchase: Purchase, url: string) {
    this.loading.next(true);
    this.checkoutService.createCheckOutSession(purchase, url).subscribe({
      next: (session) => {
        this.redirectToStripe(session);
      },
      error: (error) => {
        alert(`There was an error: ${error.error.message}`);
        this.loading.next(false);
      },
    });
  }

  private async redirectToStripe(session: any) {
    const stripe = await this.stripePromise;

    if (stripe != null) {
      let result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      this.loading.next(false);

      if (result.error) {
        alert(result.error.message);
      }
    } else {
      alert('A error happen! Please try agian later.');
      this.loading.next(false);
    }
  }

  getUrlParameter(sParam: string) {
    let sPageURL = location.search.substring(1);
    let sURLVariables = sPageURL.split('&');
    let sParameterName;

    if (location.search !== '') {
      for (let i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
          return sParameterName[1] === undefined
            ? ''
            : decodeURIComponent(sParameterName[1]);
        }
      }
    }

    return null;
  }
}
