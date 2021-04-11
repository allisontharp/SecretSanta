import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/_services/api.service';
import { environment } from 'src/environments/environment';
import { IGroup } from '../../models/group.model';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css']
})
export class GroupsComponent implements OnInit {
  groups: IGroup[] = [];
  accountGuid: string;

  constructor(private route: ActivatedRoute,
    private _apiService: ApiService) { }

  async ngOnInit(): Promise<void> {
    await this.getGroups();
  }

  async getGroups() {
    let row =  {
      tableName: environment.dynamoDbTableName,
      filters: [{field: 'userName', operation: 'equals', value: 'General'}],
      projection: ['jsonObject']
    }
    let res = await this._apiService.getRows(row);
    res.forEach(element => {
      this.groups.push(JSON.parse(element.jsonObject))
    });
  }

}
