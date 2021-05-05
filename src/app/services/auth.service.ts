import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Token } from '../common/token';
import { User } from '../common/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authToken:string|null = null;
  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  user: BehaviorSubject<User|null> = new BehaviorSubject<User|null>(null); 

  constructor() { }

  setAuthToken(user: User|null) {

    if (user != null) {
      this.authToken = "Bearer " + user.token.access;
    }
    
  }

  setUser(user: any) {
    if (user === null) {
      this.user.next(null);
      this.authToken = null;
    } else {
      const theUser = this.createUser(user);
      this.user.next(theUser);
      this.setAuthToken(theUser);
    }
  }
  
  setIsAuthenticated(state: boolean) {
    this.isAuthenticated.next(state);
  }

  createUser(user: any): User {
    const id:string = user.id;
    const email:string = user.email
    const name:string = user.user_metadata.full_name;
    const accessToken:string = user.token.access_token;
    const refreshToken:string = user.token.refresh_token;
    const tokenType:string = user.token.token_type;
    const expiresAt:number = user.token.expires_at;
    const expiresIn:number = user.token.expires_in;
    const token:Token = new Token(accessToken, expiresAt, expiresIn, refreshToken, tokenType);
    return new User(id, email, name, token);
  }
}
