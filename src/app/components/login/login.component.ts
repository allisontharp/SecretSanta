import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  incorrectGuid: boolean;
  accountGuid: string;

  constructor(private _route: ActivatedRoute,
    private _router: Router) { }

  ngOnInit(): void {
  }

  login(): void{
    if(this.accountGuid == "914ca442-ce7d-4a96-ad8c-1a99c4989cdc" || this.accountGuid == "a"){
      this.incorrectGuid = false;
      localStorage.setItem('SessionUser', this.accountGuid)

      window.location.href = '/groups';
    } else {
      this.incorrectGuid = true;
    }
  }

}
