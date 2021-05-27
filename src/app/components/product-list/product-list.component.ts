import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import {
  ProductService,
  GetResponseProducts,
} from 'src/app/services/product.service';
import { StripeService } from 'src/app/services/stripe-service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  searchMode: boolean = false;
  pageNumber: number = 1;
  pageSize: number = 10;
  totalElements: number = 0;
  prevousKeyword: string | null = null;
  loading: boolean = false;
  checkoutSuccess: boolean = false;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private route: ActivatedRoute,
    private stripeService: StripeService
  ) {}

  ngOnInit(): void {
    this.setCheckoutIsSuccessful();
    this.loading = true;
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if (this.searchMode) {
      this.handleSearchProducts();
    } else {
      this.handleListProducts();
    }
  }

  handleSearchProducts() {
    const keyword: string | null = this.route.snapshot.paramMap.get('keyword');

    if (keyword != null) {
      if (this.prevousKeyword !== keyword) {
        this.pageNumber = 1;
      }

      this.prevousKeyword = keyword;

      this.productService
        .searchProductPaginate(this.pageNumber - 1, this.pageSize, keyword)
        .subscribe((response) => {
          this.processResult(response);
          this.loading = false;
        });
    }
  }

  handleListProducts() {
    // check if id param is available
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');
    const id = this.route.snapshot.paramMap.get('id');

    if (hasCategoryId && id != null) {
      this.currentCategoryId = +id;
    } else {
      this.currentCategoryId = 1;
    }

    if (this.previousCategoryId !== this.currentCategoryId) {
      this.pageNumber = 1;
    }

    this.previousCategoryId = this.currentCategoryId;

    this.productService
      .getProductListPaginate(
        this.pageNumber - 1,
        this.pageSize,
        this.currentCategoryId
      )
      .subscribe((response) => {
        this.processResult(response);
        this.loading = false;
      });
  }

  processResult(response: GetResponseProducts) {
    this.products = response._embedded.products;
    this.pageNumber = response.page.number + 1;
    this.pageSize = response.page.size;
    this.totalElements = response.page.totalElements;
  }

  updatePageSize(target: EventTarget | null) {
    if (target !== null) {
      const size: number = +(target as HTMLInputElement).value;
      this.pageSize = size;
      this.pageNumber = 1;
      this.listProducts();
    }
  }

  setCheckoutIsSuccessful() {
    let value = this.stripeService.getUrlParameter('success');

    if (value && value == 'true') {
      this.checkoutSuccess = true;
      this.cartService.resetCart();

      setTimeout(() => {
        this.checkoutSuccess = false;
      }, 5000);
    }
  }

  addToCart(product: Product) {
    const cartItem: CartItem = new CartItem(product);
    this.cartService.addToCart(cartItem);
  }
}
