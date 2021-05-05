import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
//@ts-ignore
import netlifyIdentity from "netlify-identity-widget";
import { User } from 'src/app/common/user';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.css']
})
export class LoginStatusComponent implements OnInit {

  isAuthenticated: boolean = false;
  user!: User|null;
  storage: Storage = sessionStorage;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {

    this.subscrbieToAuthValues();

    netlifyIdentity.on('login', (user: any) => {
      this.handleUser(user);
      netlifyIdentity.close();
    })

    netlifyIdentity.on('logout', () => {
      this.authService.setUser(null);
      this.authService.setIsAuthenticated(false);
      this.router.navigateByUrl("/");
    })

    netlifyIdentity.on('init', (user: any) => {
      this.handleUser(user);
    })

    netlifyIdentity.init();

  }

  handleUser(user:any) {
    if (user === null) {
      this.authService.setUser(null);
      this.authService.setIsAuthenticated(false);
    } else {
      this.authService.setUser(user);
      this.authService.setIsAuthenticated(true);
      this.storage.setItem("userEmail", JSON.stringify(this.user?.email));
    }
  }

  subscrbieToAuthValues() {
    this.authService.isAuthenticated.subscribe(auth => {
      this.isAuthenticated = auth;
    })

    this.authService.user.subscribe(user => {
      this.user = user;
    })
  }

  login() {
    netlifyIdentity.open();
  }

  logout() {
    netlifyIdentity.logout();
  }
}

