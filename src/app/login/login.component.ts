import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  incorrectGuid: boolean;
  accountGuid: string;

  constructor() { }

  ngOnInit(): void {
  }

  login(): void{
    console.log(this.accountGuid)
    if(this.accountGuid == "914ca442-ce7d-4a96-ad8c-1a99c4989cdc"){
      this.incorrectGuid = false;
      window.location.href = '/groups';
    } else {
      this.incorrectGuid = true;
    }
  }

}
