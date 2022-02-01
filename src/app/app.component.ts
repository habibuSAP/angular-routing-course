import { Component, OnInit } from '@angular/core';
import {  Router, 
          Event, 
          NavigationStart, 
          NavigationEnd, 
          NavigationError,
          NavigationCancel } from '@angular/router';

import { AuthService } from './user/auth.service';
import { slideInAnimation} from './app.animation';
import { MessageService } from './messages/message.service';

@Component({
  selector: 'pm-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [slideInAnimation]
})
export class AppComponent implements OnInit {
  pageTitle = 'Acme Product Management';
  loading = true;

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn;
  }

  get userName(): string {
    if (this.authService.currentUser) {
      return this.authService.currentUser.userName;
    }
    return '';
  }

  get isMessageDisplayed(): boolean {
    return this.messageService.isDisplayed;
  }
  constructor(private authService: AuthService,
              private route: Router,
              public messageService: MessageService) { }
  
  ngOnInit(): void {
      this.route.events.subscribe((eventHapen: Event )=> {
        this.checkRouterEvent(eventHapen);
      })
  }

  checkRouterEvent(routerEvent: Event): void {
    if(routerEvent instanceof NavigationStart) {
      this.loading = true;
    }
    if( routerEvent instanceof NavigationEnd ||
        routerEvent instanceof NavigationError ||
        routerEvent instanceof NavigationCancel) {
          this.loading = false;
        }
  }

  displayMessages(): void {
    this.route.navigate([{outlets: {popup: ['messages']}}]);
    this.messageService.isDisplayed = true;
  }

  hideMessage(): void {
    this.route.navigate([{outlets:{popup: null}}]);
    this.messageService.isDisplayed = false;
  }
  logOut(): void {
    this.authService.logout();
    this.route.navigateByUrl('/welcome');
    
  }
}
