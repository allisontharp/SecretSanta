import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from './home/home.component'
import { AdminComponent } from './admin/admin.component';
import { JoinGroupComponent } from './join-group/join-group.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'Admin', component: AdminComponent},
  {path: 'Group/:id', component: JoinGroupComponent},
  {path: 'Group/:id/:admin', component: JoinGroupComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
