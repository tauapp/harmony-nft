import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatToolbarModule } from '@angular/material/toolbar'
import { MatIconModule } from '@angular/material/icon'
import {MatButtonModule} from '@angular/material/button';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import { LandingComponent } from './pages/landing/landing.component';
import { NotFoundComponent } from './pages/notfound/notfound.component';
import {MatCardModule} from '@angular/material/card';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HomeComponent } from './pages/home/home.component';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { NftComponent } from './pages/nft/nft.component';
import {MatDialogModule} from '@angular/material/dialog';
import { ConfirmSaleComponent } from './components/confirm-sale/confirm-sale.component'; 
import {MatInputModule} from '@angular/material/input'; 
import { FormsModule } from '@angular/forms';
import { ConfirmBuyComponent } from './components/confirm-buy/confirm-buy.component';
import {MatTooltipModule} from '@angular/material/tooltip'; 
import {GoogleLoginProvider, SocialLoginModule} from "angularx-social-login";
import {environment} from "../environments/environment";
import { CookieService } from 'ngx-cookie-service';
import { PaymentComponent } from './pages/payment/payment.component';
import { TruncateModule } from 'ng2-truncate';
import { TosComponent } from './pages/tos/tos.component';



@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    NotFoundComponent,
    HomeComponent,
    NftComponent,
    ConfirmSaleComponent,
    ConfirmBuyComponent,
    PaymentComponent,
    TosComponent,
  ],
  imports: [
    TruncateModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatCardModule,
    FontAwesomeModule,
    MatSnackBarModule,
    MatDialogModule,
    MatInputModule,
    FormsModule,
    MatTooltipModule,
    SocialLoginModule
  ],
  providers: [
    CookieService,
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: true, //keeps the user signed in
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(environment.client_id)
          }
        ]
      }
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
