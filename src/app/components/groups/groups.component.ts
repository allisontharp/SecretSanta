import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IDynamorow } from 'src/app/models/dynamorow.model';
import { ApiService } from 'src/app/_services/api.service';
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
    var g: IGroup[];
  //   g = [{ groupName: "Lemons Deal Double", groupDeadline: new Date("2021-04-04"), groupDescription: "Have Fun!", dollarMinimum: 0, dollarMaximum: 50 }
  // , { groupName: "Family Secret Santa", groupDeadline: new Date("2021-04-05"), groupDescription: "Have Fun!", dollarMinimum: 1, dollarMaximum: 25 }]

    let row = <IDynamorow>{}
    let res = await this._apiService.getGroups(row)

    res.forEach(element => {
      this.groups.push(JSON.parse(element))
    });
    console.log(JSON.parse(res[0]))
  }

}
