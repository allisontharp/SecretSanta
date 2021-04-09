import { Component, OnInit } from '@angular/core';
import { IDynamorow } from 'src/app/models/dynamorow.model';
import { IGroup } from 'src/app/models/group.model';
import { ApiService } from 'src/app/_services/api.service';

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
    console.log(this.group)
    let row = <IDynamorow>{
      groupName: this.group.groupName,
      userName: "General",
      households: "[]",
      jsonObject: JSON.stringify(this.group)
    }
    await this._apiService.insertRow(row)
  }



}
