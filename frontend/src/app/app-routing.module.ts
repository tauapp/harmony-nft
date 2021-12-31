import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { HomeComponent } from './pages/home/home.component';
import { LandingComponent } from './pages/landing/landing.component';
import { LoginComponent } from './pages/login/login.component';
import { NftComponent } from './pages/nft/nft.component';
import { NotFoundComponent } from './pages/notfound/notfound.component';

const routes: Routes = [
  {path: "", component: LandingComponent},
  {path: "login", component: LoginComponent},
  {path: "home", component: HomeComponent, /*canActivate: [AuthGuard]*/},
  {path: "nft/:id", component: NftComponent},
  // {path: "link", component: CredLinkComponent}
  {path: "**", component: NotFoundComponent}
]

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabled'
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
