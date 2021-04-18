import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IDynamorow } from 'src/app/models/dynamorow.model';
import { IGroup } from 'src/app/models/group.model';
import { ApiService } from 'src/app/_services/api.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-group-page',
  templateUrl: './group-page.component.html',
  styleUrls: ['./group-page.component.css']
})
export class GroupPageComponent implements OnInit {
  private sub: any;
  groupGuid: string;
  group: IGroup;
  participants: string[] = [];
  isAdmin: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private _apiService: ApiService,
  ) { }

  async ngOnInit(): Promise<void> {
    const _ = this.route.params.subscribe(async params => {
      this.groupGuid = decodeURIComponent(params['id']);
    })
    await this.getGroup();
    await this.getParticipants();
    this.getLocalStorage();
  }

  getLocalStorage() {
    let session = JSON.parse(localStorage.getItem("SessionUser"));
    let groups = JSON.parse(session.groups)
    let group = groups.filter(g => g.guid == this.group.guid)
    this.isAdmin = group[0]["isAdmin"]
  }

  async getGroup(): Promise<void>{
    let row =  {
      tableName: environment.dynamoDbTableName,
      filters: [{field: 'userName', operation: 'equals', value: 'General'}],
      projection: ['guid', 'jsonObject']
    }
    let res = await this._apiService.getRows(row);
    res.forEach(element => {
      let g = JSON.parse(element.jsonObject)
      if (g.groupName == this.groupGuid){
        this.group = g
        this.group.guid = element.guid
      }
    });
  }

  async getParticipants(): Promise<void>{
    let row =  {
      tableName: environment.dynamoDbTableName,
      filters: [{field: 'userName', operation: 'notequals', value: 'General'}
    ,{field: 'groupName', operation: 'equals', value: this.group.groupName}],
      projection: ['userName']
    }
    let res = await this._apiService.getRows(row);
    res.forEach(element => {
      this.participants.push(element.userName)
    });
  }

}
