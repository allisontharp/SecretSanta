import { Component, OnInit } from '@angular/core';
import { IGroup } from '../models/group.model';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css']
})
export class GroupsComponent implements OnInit {
  groups: IGroup[] = [];

  constructor() { }

  ngOnInit(): void {
    this.groups = this.getGroups();
  }

  getGroups(): IGroup[] {
    var g: IGroup[];

    g = [{ groupName: "Lemons Deal Double", groupDeadline: new Date("2021-04-04"), groupDescription: "Have Fun!", dollarMinimum: 0, dollarMaximum: 50 }
  , { groupName: "Family Secret Santa", groupDeadline: new Date("2021-04-05"), groupDescription: "Have Fun!", dollarMinimum: 1, dollarMaximum: 25 }]

    return g;
  }

}
