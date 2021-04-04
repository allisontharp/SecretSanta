import { Component, OnInit } from '@angular/core';
import { IGroup } from 'src/app/models/group.model';

@Component({
  selector: 'app-groups-create',
  templateUrl: './groups-create.component.html',
  styleUrls: ['./groups-create.component.css']
})
export class GroupsCreateComponent implements OnInit {
  group: IGroup;


  constructor() { }

  ngOnInit(): void {
  }

  createGroup() {
    console.log(this.group)
  }



}
