import { Component, OnInit } from '@angular/core';

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
  constructor() { }


  ngOnInit(): void {
  }

  submit(){
    console.log(this.participantName, this.participantEmail)
  }

}
