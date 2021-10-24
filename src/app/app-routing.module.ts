import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PersonalLoanComponent } from './components/personal-loan/personal-loan.component';

const routes: Routes = [
  { path: "", redirectTo: "/verify", pathMatch: "full" },
  { path: "verify", component: PersonalLoanComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
