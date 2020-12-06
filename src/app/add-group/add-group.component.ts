import {   Component, OnInit, Input,  Output,  OnChanges,  EventEmitter} from '@angular/core';

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

  constructor() {}

  ngOnInit() {}

 

}
