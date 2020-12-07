import {   Component, OnInit, Input,  Output,  OnChanges,  EventEmitter} from '@angular/core';
import { ApiService } from '../services/api/api.service';
import { IGroup } from '../models/group.model';
import { IDyanamoDb } from '../models/dynamoDb.model';

@Component({
  selector: 'app-add-group',
  templateUrl: './add-group.component.html',
  styleUrls: ['./add-group.component.css']
})
export class AddGroupComponent implements OnInit {
  groupName: any;
  dollarMinimum: any;
  dollarMaximum: any;
  groupRules: any;
  groupDeadline: any;
  group: IGroup = <IGroup> {};
  dynamoDbRow: IDyanamoDb = <IDyanamoDb> {};

  constructor(
    private apiService: ApiService
  ) {}

  ngOnInit() {}

  submit(){
    this.group.groupName = this.groupName;
    this.group.dollarMinimum = this.dollarMinimum;
    this.group.dollarMaximum = this.dollarMaximum;
    this.group.groupRules = this.groupRules;
    this.group.groupDeadline = this.groupDeadline;

    this.dynamoDbRow.groupName = this.groupName;
    this.dynamoDbRow.userName = 'General';
    this.dynamoDbRow.jsonObject = JSON.stringify(this.group);
    this.apiService.insertRow(this.dynamoDbRow);
  }

}
