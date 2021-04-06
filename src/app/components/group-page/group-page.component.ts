import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IGroup } from 'src/app/models/group.model';
import { IParticipant } from 'src/app/models/participant.model';

@Component({
  selector: 'app-group-page',
  templateUrl: './group-page.component.html',
  styleUrls: ['./group-page.component.css']
})
export class GroupPageComponent implements OnInit {
  private sub: any;
  groupGuid: string;
  group: IGroup;
  participants: IParticipant[];

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const _ = this.route.params.subscribe(async params => {
      this.groupGuid = decodeURIComponent(params['id']);
    })
    this.getGroup();
    this.participants = this.getParticipants();
  }

  getGroup(): void{
    // TODO: API call to return group
    this.group =  { groupName: "Lemons Deal Double", groupDeadline: new Date("2021-04-04"), groupDescription: "Have Fun!", dollarMinimum: 0, dollarMaximum: 50 }
  }

  getParticipants(): IParticipant[]{
    let p: IParticipant[];

    p = [{name: "Allison Tharp", email: "allison@herdomain.com", color: "gray", food: "mexican", team: "bolts", scent: "vanilla", store: "lego", gadget: "home automation", enough: "board games", enjoy: "hockey games", misc: "no hats"}
  ,{name: "Troy Brewer", email: "troy@hisdomain.com", color: "blue", food: "anything new", team: "none", scent: "earthy", store: "duluth", gadget: "home automation", enough: "board games", enjoy: "hockey games", misc: "no hats"}];

    return p

  }

}
