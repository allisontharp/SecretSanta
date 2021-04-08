import { Component, Input, OnInit } from '@angular/core';
import { IDynamorow } from 'src/app/models/dynamorow.model';
import { IGroup } from 'src/app/models/group.model';
import { IParticipant } from 'src/app/models/participant.model';
import { ApiService } from 'src/app/_services/api.service';

@Component({
  selector: 'app-questionaire',
  templateUrl: './questionaire.component.html',
  styleUrls: ['./questionaire.component.css']
})
export class questionaireComponent implements OnInit {
  participant: IParticipant = <IParticipant> {};
  @Input() group: IGroup;
  
  constructor(
    private apiService: ApiService
  ) { }

  ngOnInit(): void {
  }

  async submit() {
    console.log(this.participant)
    let row = <IDynamorow>{
      groupName : this.group.groupName,
      userName: this.participant.name,
      jsonObject: JSON.stringify(this.participant),
      households: "[]"
    };
    
    await this.apiService.insertRow(row)

    document.getElementById('questionaireModal').click()
  }

}
