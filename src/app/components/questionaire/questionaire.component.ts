import { Component, Input, OnInit } from '@angular/core';
import { IDynamorow } from 'src/app/models/dynamorow.model';
import { IGroup } from 'src/app/models/group.model';
import { IParticipant } from 'src/app/models/participant.model';
import { ApiService } from 'src/app/_services/api.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-questionaire',
  templateUrl: './questionaire.component.html',
  styleUrls: ['./questionaire.component.css']
})
export class questionaireComponent implements OnInit {
  participant: IParticipant = <IParticipant> {};
  @Input() group: IGroup;
  
  constructor(
    private _apiService: ApiService
  ) { }

  ngOnInit(): void {
  }

  async submit() {
    let ls = JSON.parse(localStorage.getItem("SessionUser"))
    let guid = ls["guid"]
    let email = await this.getUserEmail(guid)
    this.participant.email = email
    let row = <IDynamorow>{
      groupName : this.group.groupName,
      userName: this.participant.name,
      guid: guid,
      jsonObject: JSON.stringify(this.participant),
      households: "[]",
      tableName: environment.dynamoDbTableName
    };
    await this._apiService.insertRow(row)

    document.getElementById('questionaireModal').click()
  }

  async getUserEmail(guid: string){
    let row =  {
      tableName: environment.dynamoDbTableName,
      filters: [{field: 'guid', operation: 'equals', value: guid},
    {field: 'groupName', operation: 'equals', value: 'login'}],
      projection: ['userName']
    }
    let res = await this._apiService.getRows(row);
    if(res.length == 1){
      return res[0].userName
    }
  }

}
