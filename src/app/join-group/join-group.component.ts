import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IParticipant } from '../models/participant.model';
import { IDyanamoDb } from '../models/dynamoDb.model';
import { ApiService } from '../services/api/api.service';
import { FormGroup, FormControl } from '@angular/forms';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { IGroup } from '../models/group.model';

@Component({
  selector: 'app-join-group',
  templateUrl: './join-group.component.html',
  styleUrls: ['./join-group.component.css']
})
export class JoinGroupComponent implements OnInit {

  private sub: any;
  groupName: string = "";
  participants: IParticipant[] = [];
  dbResult: IDyanamoDb[] = [];
  householdName: string = "";
  dynamoDbRow: IDyanamoDb = <IDyanamoDb> {};
  households: any[] = [];
  group: any;
  groupDetails: IGroup = <IGroup> {};

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService
  ) {
 
  }
  isAdmin: boolean = false;
  participantsInGroup: any;

  async ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.groupName = params['id'];
      if (params['admin'] == 'superSecretAdmin') {
        this.isAdmin = true;
      }
    });

    await this.getParticipants();
    await this.getGroup();
    await this.getHouseholds();
    console.log('groupDetails:')
    console.log(this.groupDetails);
    console.log(this.groupDetails.dollarMinimum)
  }

  async getParticipants() {
    var r = await this.apiService.getParticipants(this.groupName);
    this.dbResult = r.result;
    this.dbResult.forEach(group => {
      let p: IParticipant = JSON.parse(group.jsonObject)
      p.checked = false;
      this.participants.push(p);
    });
  }

  async getGroup(){
    var r = await this.apiService.getGroup(this.groupName);
    this.group = r.r;
  }

  async getHouseholds(){
    var group = this.group.filter(function (x:IDyanamoDb) {
      return x.userName == "General"
    })
    this.groupDetails = JSON.parse(group[0].jsonObject);
    if(!!group[0].houseHolds){
      this.households = group[0].houseHolds 
    }
  }

  async submit() {
    var inGroup = this.participants.filter(function (participant) {
      return participant.checked == true;
    });
    this.participantsInGroup = inGroup.map(a => a.participantName);
 
    var x = {
        'householdName': this.householdName,
        'householdParticipants': this.participantsInGroup
    }
    this.households.push(x);
    this.dynamoDbRow.groupName = this.groupName;
    this.dynamoDbRow.userName = 'General';
    this.dynamoDbRow.households = this.households;

    await this.apiService.updateParticipants(this.dynamoDbRow)
  }

  async sendEmails(){
    console.log(this.group)
    await this.apiService.sendSecretSantaEmails(this.group)
  }

 
}
