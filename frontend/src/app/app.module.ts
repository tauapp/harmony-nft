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
import { LoginComponent } from './pages/login/login.component';
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



@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    NotFoundComponent,
    LoginComponent,
    HomeComponent,
    NftComponent,
    ConfirmSaleComponent,
    ConfirmBuyComponent,
  ],
  imports: [
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
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
