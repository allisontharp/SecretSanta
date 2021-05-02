import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { IGroup } from 'src/app/models/group.model';
import { IParticipant } from 'src/app/models/participant.model';

@Component({
  selector: 'app-create-household',
  templateUrl: './create-household.component.html',
  styleUrls: ['./create-household.component.css']
})
export class CreateHouseholdComponent implements OnInit {
  householdName: string;
  @Input() participants: IParticipant[] = [];
  @Input() group!: IGroup;
  houseHolds: {name: String, participantNames: String[]}[];
  houseHoldParticipants: {name: String, isChecked: boolean}[];

  constructor() {}

  ngOnChanges(changes: SimpleChanges){
    // console.log(changes['myInput'].currentValue);
    console.log(changes)
  }

  ngOnInit(): void {
    this.houseHolds = JSON.parse(this.group.houseHolds)
  }

  getHouseHoldParticipants(){
    console.log('getHouseHoldParticipants:')
    this.participants.forEach(p => {
      console.log('participant:');
      console.log(p);
      let houseHoldParticipant: { name: String; isChecked: boolean; };
      houseHoldParticipant.name = p.name;
      houseHoldParticipant.isChecked = false;
      console.log(houseHoldParticipant);
      this.houseHoldParticipants.push(houseHoldParticipant);
    })
  }

}
