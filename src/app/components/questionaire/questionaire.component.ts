import { Component, Input, OnInit } from '@angular/core';
import { IGroup } from 'src/app/models/group.model';
import { IParticipant } from 'src/app/models/participant.model';

@Component({
  selector: 'app-questionaire',
  templateUrl: './questionaire.component.html',
  styleUrls: ['./questionaire.component.css']
})
export class questionaireComponent implements OnInit {
  participant: IParticipant = <IParticipant> {};

  @Input() group: IGroup;
  
  constructor() { }

  ngOnInit(): void {
  }

  submit() {
    console.log(this.participant)
    document.getElementById('questionaireModal').click()
  }

}
