import { Component, OnInit } from '@angular/core';
//@ts-ignore
import netlifyIdentity from "netlify-identity-widget";
import { Token } from 'src/app/common/token';
import { User } from 'src/app/common/user';

@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.css']
})
export class LoginStatusComponent implements OnInit {

  isAuthenticated: boolean = false;
  user!: User|null;

  constructor() { }

  ngOnInit() {

    netlifyIdentity.on('login', (user: any) => {
      this.user = this.createUser(user);
      this.isAuthenticated = true;
      netlifyIdentity.close();
      console.log(this.user);
    })

    netlifyIdentity.on('logout', () => {
      this.user = null;
      this.isAuthenticated = false;
    })

    netlifyIdentity.init();
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

  login() {
    netlifyIdentity.open();
  }

  logout() {
    netlifyIdentity.logout();
  }
}

