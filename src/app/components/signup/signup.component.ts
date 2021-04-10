import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/_services/api.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  email: string;
  accountExists: boolean;
  accountCreated: boolean;
  accountGuid: string;

  constructor(
    private _apiService: ApiService
  ) { }

  ngOnInit(): void {
    
  }

  signUp(): void {
    /*
      - Check for account under that email address
      - If none exist, create an account and email them their GUID (as well as display)
    */
    let row =  {
      tableName: 'secretSanta',
      filters: [{field: 'userName', operation: 'equals', value: 'General'}],
      projection: ['userName']
    }
    this._apiService.getRows(row);
    
    this.accountExists = false;
    this.accountCreated = false;
    if (this.email == "allison.tharp@gmail.com"){
      this.accountExists = true;
    } else {
      this.accountGuid = "914ca442-ce7d-4a96-ad8c-1a99c4989cdc"
      this.accountCreated = true;
    }
  }

  copyInputMessage(inputElement){
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
  }
}
