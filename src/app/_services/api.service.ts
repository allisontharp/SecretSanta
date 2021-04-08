import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IDynamorow } from '../models/dynamorow.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = environment.dynamoDbApiUrl;
  }

  insertRow(dynamoDbRow: IDynamorow): any {
    const url = this.apiUrl + '/insertRow';
    return this.http.post(url, dynamoDbRow, { responseType: 'json' }).toPromise();
  }
}