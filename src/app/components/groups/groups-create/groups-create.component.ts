import { Component, OnInit } from '@angular/core';
import { IDynamorow } from 'src/app/models/dynamorow.model';
import { IGroup } from 'src/app/models/group.model';
import { ApiService } from 'src/app/_services/api.service';
import { environment } from 'src/environments/environment';
import {v4 as uuidv4} from 'uuid';

@Component({
  selector: 'app-groups-create',
  templateUrl: './groups-create.component.html',
  styleUrls: ['./groups-create.component.css']
})
export class GroupsCreateComponent implements OnInit {
  group: IGroup = <IGroup> {};


  constructor(
    private _apiService: ApiService
  ) { }

  ngOnInit(): void {
  }

  async addGroupToDynamo():Promise<string>  {
    /* Add the group information to db */
    let groupGuid = uuidv4();
    let row = <IDynamorow>{
      tableName: environment.dynamoDbTableName,
      groupName: this.group.groupName,
      userName: "General",
      households: "[]",
      jsonObject: JSON.stringify(this.group),
      guid: groupGuid
    }
    await this._apiService.insertRow(row)
    return groupGuid
  }

  addGroupToLocalStorage(groupGuid:string): [any, string]{
    /* Add this group to the user's groups */
    /* Get current user's groups */
    let session = JSON.parse(localStorage.getItem("SessionUser"));
    let currentGroups:any[] = []
    if (session.groups){
      currentGroups.push(JSON.parse(session.groups))
    }
    /* Add this group to local settings */
    let currentGroup = {
      guid: groupGuid,
      isAdmin: true
    }
    currentGroups.push(currentGroup)
    session.groups = JSON.stringify(currentGroups);

    localStorage.setItem('SessionUser', JSON.stringify(session))
    return [session.groups, session.guid]
  }

  async createGroup() {
    let groupGuid = await this.addGroupToDynamo();
    let [currentGroups, accountGuid] = this.addGroupToLocalStorage(groupGuid);

    let row =  {
      tableName: environment.dynamoDbTableName,
      filters: [{field: 'groupName', operation: 'equals', value: 'login'}
      , {field: 'guid', operation: 'equals', value: accountGuid}],
      projection: ['groupName', 'userName', 'jsonObject', 'guid', 'tableName']
    }
    let res = await this._apiService.getRows(row);
    
    res[0].jsonObject = currentGroups; //JSON.stringify(currentGroups)

    await this._apiService.insertRow(res[0]);

  }



}
