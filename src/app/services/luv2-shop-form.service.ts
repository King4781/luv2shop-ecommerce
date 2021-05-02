import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Country } from '../common/country';
import { State } from '../common/state';

@Injectable({
  providedIn: 'root'
})
export class Luv2ShopFormService {

  private months: Month[] = [
    {numberValue: 1, stringValue: "January"}, 
    {numberValue: 2, stringValue: "Febuary"}, 
    {numberValue: 3, stringValue: "March"}, 
    {numberValue: 4, stringValue: "April"},
    {numberValue: 5, stringValue: "May"},
    {numberValue: 6, stringValue: "June"},
    {numberValue: 7, stringValue: "July"},
    {numberValue: 8, stringValue: "August"},
    {numberValue: 9, stringValue: "September"},
    {numberValue: 10, stringValue: "October"}, 
    {numberValue: 11, stringValue: "November"}, 
    {numberValue: 12, stringValue: "December"}
  ];

  private baseUrl = "http://localhost:8080/api";
  private countriesUrl = this.baseUrl + "/countries";
  private statesUrl = this.baseUrl + "/states";

  constructor(private httpClient: HttpClient) { }

  getCountries(): Observable<GetResponseCountries> {
    return this.httpClient.get<GetResponseCountries>(this.countriesUrl);
  }

  getStates(countryCode: string): Observable<GetResponseStates> {
    const searchUrl = this.statesUrl + "/search/findByCountryCode?code=" + countryCode;
    return this.httpClient.get<GetResponseStates>(searchUrl);
  }

  getCreditCardMonths(startMonth: number): Observable<Month[]> {
    
    const data: Month[] = [];

    for (let month = startMonth; month <= 12; month++) {
      let currMonth: Month = this.months[month - 1];
      data.push(currMonth);
    }

    return of(data);
  }

  getMonths(): Month[] {
    return this.months;
  }

  getCreditCardYears(): Observable<number[]> {

    const data: number[] = [];

    const startYear: number = new Date().getFullYear();
    const endYear: number = startYear + 10;

    for (let year = startYear; year <= endYear; year++) {
      data.push(year);
    }

    return of(data);
  }

}

export interface Month {
  numberValue: number;
  stringValue: string;
}

interface GetResponseCountries {
  _embedded: {
    countries: Country[]
  }
}

interface GetResponseStates {
  _embedded: {
    states: State[]
  }
}
