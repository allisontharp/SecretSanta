import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FormsModule } from '@angular/forms';
import { GroupsComponent } from './components/groups/groups.component';
import { GroupsCreateComponent } from './components/groups/groups-create/groups-create.component';
import { GroupCardComponent } from './components/groups/group-card/group-card.component';
import { SignupComponent } from './components/signup/signup.component';
import { LoginComponent } from './components/login/login.component';
import { AuthguardService } from './_services/authguard.service';
import { JoinExistingComponent } from './components/join-existing/join-existing.component';
import { GroupPageComponent } from './components/group-page/group-page.component';
import { questionnaireComponent } from './components/questionnaire/questionnaire.component';
import { HttpClientModule } from '@angular/common/http';
import { CreateHouseholdComponent } from './components/create-household/create-household.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    GroupsComponent,
    GroupsCreateComponent,
    GroupCardComponent,
    SignupComponent,
    LoginComponent,
    JoinExistingComponent,
    GroupPageComponent,
    questionnaireComponent,
    CreateHouseholdComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    AuthguardService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
