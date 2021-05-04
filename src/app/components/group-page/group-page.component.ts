import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IGroup } from 'src/app/models/group.model';
import { IParticipant } from 'src/app/models/participant.model';
import { ApiService } from 'src/app/_services/api.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-group-page',
  templateUrl: './group-page.component.html',
  styleUrls: ['./group-page.component.css']
})
export class GroupPageComponent implements OnInit {
  private sub: any;
  groupGuid: string;
  group: IGroup;
  participants: IParticipant[] = [];
  isAdmin: boolean = false;
  answerUpdate: string = 'Answer';
  userGuid: string;
  participant: IParticipant = <IParticipant>{};

  constructor(
    private route: ActivatedRoute,
    private _apiService: ApiService,
  ) { }

  async ngOnInit(): Promise<void> {
    const _ = this.route.params.subscribe(async params => {
      this.groupGuid = decodeURIComponent(params['id']);
    })
    await this.getGroup();
    await this.getParticipants();
    this.getLocalStorage();
    this.hasAnsweredQuestionaire();
  }

  getLocalStorage() {
    let session = JSON.parse(localStorage.getItem("SessionUser"));
    this.userGuid = session.guid;
    let groups = JSON.parse(session.groups)
    let group = groups.filter(g => g.guid == this.group.guid)
    this.isAdmin = group[0]["isAdmin"]
  }

  async getGroup(): Promise<void>{  
    let row =  {
      tableName: environment.dynamoDbTableName,
      filters: [{field: 'guid', operation: 'equals', value: this.groupGuid}],
      projection: ['guid', 'jsonObject', 'houseHolds']
    }
    let res = await this._apiService.getRows(row);
    if(res.length == 1){
      this.group = JSON.parse(res[0].jsonObject)
      this.group.guid = res[0].guid
      this.group.houseHolds = res[0].houseHolds
    }
  }

  async getParticipants(): Promise<void>{
    let row =  {
      tableName: environment.dynamoDbTableName,
      filters: [{field: 'userName', operation: 'notequals', value: 'General'}
    ,{field: 'groupName', operation: 'equals', value: this.group.groupName}],
      projection: ['userName', 'guid', 'jsonObject',]
    }
    let res = await this._apiService.getRows(row);
    res.forEach(element => {
      let participant: IParticipant;
      let j = JSON.parse(element.jsonObject)
      participant = {
        guid: element.guid,
        name: j.name,
        color: j.color,
        email: j.email,
        food: j.food,
        scent: j.scent,
        team: j.team,
        store: j.store, 
        gadget: j.gadget,
        enough: j.enough, 
        enjoy: j.enjoy,
        misc: j.misc,
        isChecked: false
      }
      this.participants.push(participant)
    });
  }

  hasAnsweredQuestionaire() {
    let p = this.participants.find(x => x.guid == this.userGuid);
    if(p){
      this.answerUpdate = 'Update';
      this.participant = p;
    }
  }

  generateMatches(){
    let body = {
      group: this.group,
      participants: this.participants
    }
    this._apiService.generateMatches(body)
  }


}
