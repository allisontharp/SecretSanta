import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfigServiceService {
  private apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = environment.dynamoDbApiUrl;
  }

  getGroups(groupName: string): any {
    const url = this.apiUrl + '/getGroup/' + groupName;
    console.log(url);
    return this.http.get(url).toPromise();
  }
}
