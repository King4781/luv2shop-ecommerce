import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Country } from '../common/country';
import { State } from '../common/state';

@Injectable({
  providedIn: 'root',
})
export class Luv2ShopFormService {
  private countriesUrl = environment.API_URL + '/countries';
  private statesUrl = environment.API_URL + '/states';

  constructor(private httpClient: HttpClient) {}

  getCountries(): Observable<GetResponseCountries> {
    return this.httpClient.get<GetResponseCountries>(this.countriesUrl);
  }

  getStates(countryCode: string): Observable<GetResponseStates> {
    const searchUrl =
      this.statesUrl + '/search/findByCountryCode?code=' + countryCode;
    return this.httpClient.get<GetResponseStates>(searchUrl);
  }
}

interface GetResponseCountries {
  _embedded: {
    countries: Country[];
  };
}

interface GetResponseStates {
  _embedded: {
    states: State[];
  };
}
