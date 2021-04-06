import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { GroupsCreateComponent } from './components/groups/groups-create/groups-create.component';
import { GroupsComponent } from './components/groups/groups.component';
import { LoginComponent } from './components/login/login.component';
import { AuthenticationGuard } from './authentication.guard';
import { GroupPageComponent } from './components/group-page/group-page.component';


const routes: Routes = [
  {path: '', redirectTo:"/login",pathMatch:"full"},
  // {path: '', component: HomeComponent},
  {path: 'login', component:LoginComponent},
  {path: 'groups', component: GroupsComponent, canActivate:[AuthenticationGuard]},
  {path: 'groups/create', component: GroupsCreateComponent, canActivate:[AuthenticationGuard]},
  {path: 'group/:id', component: GroupPageComponent, canActivate:[AuthenticationGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
