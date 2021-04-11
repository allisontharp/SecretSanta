import { Component, OnInit } from '@angular/core';
import { IDynamorow } from 'src/app/models/dynamorow.model';
import { ApiService } from 'src/app/_services/api.service';
import { environment } from 'src/environments/environment';
import {v4 as uuidv4} from 'uuid';
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

  async signUp(): Promise<void> {
    this.accountExists = false;
    this.accountCreated = false;
    /*
      - Check for account under that email address
      - If none exist, create an account and email them their GUID (as well as display)
    */
    let row =  {
      tableName: environment.dynamoDbTableName,
      filters: [{field: 'groupName', operation: 'equals', value: 'login'}
      , {field: 'userName', operation: 'equals', value: this.email}],
      projection: ['userName']
    }
    let res = await this._apiService.getRows(row);
    if (res.length == 0) {
      this.accountGuid = uuidv4();
      let insertRow = {
        groupName: 'login',
        userName: this.email,
        guid: this.accountGuid 
      }
      await this._apiService.insertRow(insertRow);
      this.accountCreated = true;
    }else {
      this.accountExists = true;
    }
  }

  copyInputMessage(inputElement){
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
  }
}
