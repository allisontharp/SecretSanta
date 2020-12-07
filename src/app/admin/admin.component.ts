import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api/api.service';
import { IGroup } from '../models/group.model';
import { IDyanamoDb } from '../models/dynamoDb.model';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  groups: IGroup[] = [];
  dbResult: IDyanamoDb[] = [];
  constructor(
    private apiService: ApiService
  ) { }

  async ngOnInit() {
    await this.getGroups();
  }
  
  async getGroups(){
    var g = await this.apiService.getGroups();
    this.dbResult = g.result;
    this.dbResult.forEach(group => {
      let r: IGroup = JSON.parse(group.jsonObject)
      this.groups.push(r);
    });
  }

}
