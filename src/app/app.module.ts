/*  Project developed by Habibu Abdullahi 2022.02.01
  A step by step course learning of Angular Routing 
*/
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Imports for loading & configuring the in-memory web api
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { ProductData } from './products/product-data';

import { AppComponent } from './app.component';
import { AppRoutingModule} from './app-routing.module';

/* Feature Modules */
import { UserModule } from './user/user.module';
import { MessageModule } from './messages/message.module';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    InMemoryWebApiModule.forRoot(ProductData, { delay: 1000 }),
    UserModule,
    MessageModule,
    AppRoutingModule,
  ],
  declarations: [
    AppComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
