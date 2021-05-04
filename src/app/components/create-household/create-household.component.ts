import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { IGroup } from 'src/app/models/group.model';
import { IParticipant } from 'src/app/models/participant.model';
import { ApiService } from 'src/app/_services/api.service';

@Component({
  selector: 'app-create-household',
  templateUrl: './create-household.component.html',
  styleUrls: ['./create-household.component.css']
})
export class CreateHouseholdComponent implements OnInit {
  part: IParticipant[] = []
  householdName: string;
  @Input() set participants(data: IParticipant[]) {
    this.part = data;
  };
  @Input() group!: IGroup;
  houseHolds: {name: String, participantGUIDs: String[]}[];
  houseHoldParticipants: {name: String, isChecked: boolean}[] = [];

  constructor(
    private _apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.houseHolds = JSON.parse(this.group.houseHolds)
    this.getHouseHoldParticipants();
  }

  getHouseHoldParticipants(){
    this.part.forEach(p => {
      let houseHoldParticipant: { name: String; isChecked: boolean; };
      houseHoldParticipant = {
        name: p.name,
        isChecked: false
      }
      this.houseHoldParticipants.push(houseHoldParticipant);
    })
  }

  async createHouseHold(){
    let inGroup = this.part.filter(function (participant) {
      return participant.isChecked == true;
    });

    let participantGUIDs = inGroup.map(a => a.guid);

    let houseHold = {
      name: this.householdName,
      participantGUIDs: participantGUIDs
    };

    this.houseHolds.push(houseHold);
    this.group.houseHolds = JSON.stringify(this.houseHolds);
    await this._apiService.updateGroup(this.group)
  }

}
