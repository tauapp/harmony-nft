import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';
import { NotFoundComponent } from './pages/notfound/notfound.component';

const routes: Routes = [
  {path: "", component: LandingComponent},
  {path: "**", component: NotFoundComponent}
]

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabled'
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
