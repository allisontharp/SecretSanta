import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/_services/api.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-join-existing',
  templateUrl: './join-existing.component.html',
  styleUrls: ['./join-existing.component.css']
})
export class JoinExistingComponent implements OnInit {
  groupGuid: string; 
  incorrectGuid = false;

  constructor(private _apiService: ApiService) { }

  ngOnInit(): void {
  }

  async join(): Promise<void> {
    let row =  {
      tableName: environment.dynamoDbTableName,
      filters: [{field: 'guid', operation: 'equals', value: this.groupGuid}],
      projection: ['jsonObject']
    }
    let res = await this._apiService.getRows(row);

    if (res.length == 1) {
      this.incorrectGuid = false;
      let [currentGroups, accountGuid] = this._apiService.addGroupToLocalStorage(this.groupGuid, false);
      await this._apiService.addGroupToUserDynamo(accountGuid, currentGroups);
      document.getElementById('joinExistingModal').click();
    }else {
      this.incorrectGuid = true;
    }
  }

}
