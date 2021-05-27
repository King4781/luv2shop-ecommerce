import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../common/product';
import { ProductCategory } from '../common/product-category';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private baseUrl: string = environment.base_url;

  constructor(private httpClient: HttpClient) {}

  getProductListPaginate(
    page: number,
    pageSize: number,
    categoryId: number
  ): Observable<GetResponseProducts> {
    const searchUrl: string = `${this.baseUrl}/products/search/findByProductCategoryId?id=${categoryId}&page=${page}&size=${pageSize}`;
    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }

  getProductList(categoryId: number): Observable<GetResponseProducts> {
    const searchUrl: string = `${this.baseUrl}/products/search/findByProductCategoryId?id=${categoryId}`;
    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }

  getProductCategories(): Observable<GetResponseProductCategory> {
    const categoryUrl: string = `${this.baseUrl}/product-category`;
    return this.httpClient.get<GetResponseProductCategory>(categoryUrl);
  }

  searchProducts(keyword: string): Observable<GetResponseProducts> {
    const searchUrl: string = `${this.baseUrl}/products/search/findProductByNameContaining?name=${keyword}`;
    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }

  searchProductPaginate(
    page: number,
    pageSize: number,
    keyword: string
  ): Observable<GetResponseProducts> {
    const searchUrl: string = `${this.baseUrl}/products/search/findProductByNameContaining?name=${keyword}&page=${page}&size=${pageSize}`;
    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }

  getProduct(id: number): Observable<Product> {
    const productUrl: string = `${this.baseUrl}/products/${id}`;
    return this.httpClient.get<Product>(productUrl);
  }
}

export interface GetResponseProducts {
  _embedded: {
    products: Product[];
  };
  page: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  };
}

interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
  };
}
