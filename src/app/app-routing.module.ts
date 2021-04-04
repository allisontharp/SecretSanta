import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { GroupsCreateComponent } from './groups/groups-create/groups-create.component';
import { GroupsComponent } from './groups/groups.component';


const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'groups', component: GroupsComponent},
  {path: 'groups/create', component: GroupsCreateComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
