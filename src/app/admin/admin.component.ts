import { Component, OnInit } from '@angular/core';
import { ConfigServiceService } from '../services/configservice/config-service.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  constructor(
    private apiService: ConfigServiceService
  ) { }

  ngOnInit(): void {
    console.log('onInit')
    var x =  this.apiService.getGroups('first');
    console.log(x)
  }
  

}
