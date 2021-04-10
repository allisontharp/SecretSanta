import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IDynamorow } from 'src/app/models/dynamorow.model';
import { IGroup } from 'src/app/models/group.model';
import { IParticipant } from 'src/app/models/participant.model';
import { ApiService } from 'src/app/_services/api.service';

@Component({
  selector: 'app-group-page',
  templateUrl: './group-page.component.html',
  styleUrls: ['./group-page.component.css']
})
export class GroupPageComponent implements OnInit {
  private sub: any;
  groupGuid: string;
  group: IGroup;
  participants: string[];

  constructor(
    private route: ActivatedRoute,
    private _apiService: ApiService
  ) { }

  async ngOnInit(): Promise<void> {
    const _ = this.route.params.subscribe(async params => {
      this.groupGuid = decodeURIComponent(params['id']);
    })
    await this.getGroup();
    await this.getParticipants();
  }

  async getGroup(): Promise<void>{
    let row =  {
      tableName: 'secretSanta',
      filters: [{field: 'userName', operation: 'equals', value: 'General'}],
      projection: ['jsonObject']
    }
    let res = await this._apiService.getRows(row);
    console.log(res)
    res.forEach(element => {
      let g = JSON.parse(element.jsonObject)
      if (g.groupName == this.groupGuid){
        this.group = g
      }
    });
  }

  async getParticipants(): Promise<void>{
    let row = <IDynamorow>{
          groupName: this.group.groupName
    }
    
    this.participants = await this._apiService.getParticipants(row)
  }

}
