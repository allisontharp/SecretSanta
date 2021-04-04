import { Component, Input, OnInit } from '@angular/core';
import { IGroup } from 'src/app/models/group.model';

@Component({
  selector: 'app-group-card',
  templateUrl: './group-card.component.html',
  styleUrls: ['./group-card.component.css']
})
export class GroupCardComponent implements OnInit {

  constructor() { }

  @Input() group!: IGroup;

  ngOnInit(): void {
  }

}
