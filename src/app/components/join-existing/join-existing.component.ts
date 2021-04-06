import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-join-existing',
  templateUrl: './join-existing.component.html',
  styleUrls: ['./join-existing.component.css']
})
export class JoinExistingComponent implements OnInit {
  groupGuid: string; 
  incorrectGuid = false;

  constructor() { }

  ngOnInit(): void {
  }

  join(): void {
    if(this.groupGuid == "EXISTINGGROUP"){
      this.incorrectGuid = false;
      document.getElementById('joinExistingModal').click();
    } else {
      this.incorrectGuid = true;
    }
  }

}
