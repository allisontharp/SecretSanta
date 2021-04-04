import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-lists-create',
  templateUrl: './lists-create.component.html',
  styleUrls: ['./lists-create.component.css']
})
export class ListsCreateComponent implements OnInit {
  listName: string;
  listDescription: string;
  listDeadline: Date;


  constructor() { }

  ngOnInit(): void {
  }

  createList() {
    console.log(this.listName)
    console.log(this.listDescription)
    console.log(this.listDeadline)
  }



}
