import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-household',
  templateUrl: './create-household.component.html',
  styleUrls: ['./create-household.component.css']
})
export class CreateHouseholdComponent implements OnInit {
  householdName: string;
  @Input() participants!: string[];

  constructor() { }

  ngOnInit(): void {
  }

}
