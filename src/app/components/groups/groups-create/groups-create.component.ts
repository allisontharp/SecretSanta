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

  async createGroup() {
    // let groupGuid = await this.addGroupToDynamo();
    let groupGuid = await this._apiService.addGroupToDynamo(this.group)
    let [currentGroups, accountGuid] = this._apiService.addGroupToLocalStorage(groupGuid, true);

    await this._apiService.addGroupToUserDynamo(accountGuid, currentGroups)
  }



}
