import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { IndicatorDetailsComponent } from './pages/indicator-details/indicator-details.component';
import { IndicatorGroupsComponent } from './pages/indicator-groups/indicator-groups.component';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'indicator/:type-of-action/:id',
    component: IndicatorDetailsComponent
  },
  {
    path: 'indicatorGroups/:id',
    component: IndicatorGroupsComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
