import { Component, OnInit, Input, EventEmitter, Output, ViewChild } from '@angular/core';
import { IDyanamoDb } from '../models/dynamoDb.model';
import { IParticipant } from '../models/participant.model';
import { ApiService } from '../services/api/api.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  participantName: any;
  participantEmail: any;
  participantColor: any;
  participantFood: any;
  participantTeam: any;
  participantScent: any;
  participantStore: any;
  participantGadget: any;
  participantEnough: any;
  participantEnjoy: any;
  participantMisc: any;
  participant: IParticipant = <IParticipant> {};

  @Input() groupName: any;
  
  constructor(
    private apiService: ApiService
  ) { }

  dynamoDbRow: IDyanamoDb = <IDyanamoDb> {};

  ngOnInit(): void {
  }

  async submit(){
    this.participant = {
      participantName: this.participantName,
      participantEmail: this.participantEmail,
      participantColor: this.participantColor,
      participantFood: this.participantFood,
      participantTeam: this.participantTeam,
      participantScent: this.participantScent,
      participantStore: this.participantStore,
      participantGadget: this.participantGadget,
      participantEnough: this.participantEnough,
      participantEnjoy: this.participantEnjoy,
      participantMisc: this.participantMisc,
      checked: false
    }
    this.dynamoDbRow.groupName = this.groupName;
    this.dynamoDbRow.userName = this.participantName;
    this.dynamoDbRow.jsonObject = JSON.stringify(this.participant);
    console.log(this.dynamoDbRow);
    await this.apiService.insertRow(this.dynamoDbRow);
    window.location.reload();
  }

}
