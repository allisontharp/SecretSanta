import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { IGroup } from 'src/app/models/group.model';
import { IDyanamoDb } from 'src/app/models/dynamoDb.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = environment.dynamoDbApiUrl;
  }

  getGroups(): any {
    const url = this.apiUrl + '/getGroups';
    return this.http.get(url).toPromise();
  }

  getGroup(groupName: string): any {
    const url = this.apiUrl + '/getGroup/' + groupName;
    return this.http.get(url).toPromise();
  }

  insertRow(dynamoDbRow: IDyanamoDb): any{
    const url = this.apiUrl + '/insertRow';
    return this.http.post(url, dynamoDbRow, {responseType: 'text'}).toPromise();
  }

  getParticipants(groupName: string): any {
    const url = this.apiUrl + '/getParticipants/' + groupName;
    return this.http.get(url).toPromise();
  }

  updateParticipants(dynamoDbRow: IDyanamoDb): any {
    const url = this.apiUrl + '/updateHouseholds';
    console.log(url);
    return this.http.post(url, dynamoDbRow, {responseType: 'text'}).toPromise();
  }

  sendSecretSantaEmails(group: IGroup): any{
    const url = this.apiUrl + '/generateMatches';
    console.log(url);
    return this.http.post(url, group, {responseType: 'text'}).toPromise();
  }

}
