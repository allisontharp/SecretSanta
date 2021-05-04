import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/_services/api.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  incorrectGuid: boolean;
  accountGuid: string;

  constructor(private _route: ActivatedRoute,
    private _router: Router,
    private _apiService: ApiService) { }

  ngOnInit(): void {
  }

  async login(): Promise<void>{
    let row =  {
      tableName: environment.dynamoDbTableName,
      filters: [{field: 'guid', operation: 'equals', value: this.accountGuid},
    {field: 'groupName', operation: 'equals', value:'login'}],
      projection: ['jsonObject']
    }
    let res = await this._apiService.getRows(row);
    if (res.length == 1) {
      this.incorrectGuid = false;
      let localRow = {
        guid: this.accountGuid,
        groups: res[0].jsonObject
      }
      localStorage.setItem('SessionUser', JSON.stringify(localRow))
      window.location.href = '/groups';
    }else {
      this.incorrectGuid = true;
    }
  }

}
