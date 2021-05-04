import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IDynamorow } from '../models/dynamorow.model';
import { HttpClient } from '@angular/common/http';
import { v4 as uuidv4 } from 'uuid';
import { IGroup } from '../models/group.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = environment.dynamoDbApiUrl;
  }

  insertRow(dynamoDbRow: any): any {
    const url = this.apiUrl + '/insertRow';
    return this.http.post(url, dynamoDbRow, { responseType: 'json' }).toPromise();
  }

  getRows(row: any): any {
    const url = this.apiUrl + '/getRows';
    return this.http.post(url, row, { responseType: 'json' }).toPromise();
  }

  async addGroupToDynamo(group: IGroup): Promise<string> {
    /* Add the group information to db */
    let groupGuid = uuidv4();
    let row = <IDynamorow>{
      tableName: environment.dynamoDbTableName,
      groupName: group.groupName,
      userName: "General",
      households: "[]",
      jsonObject: JSON.stringify(group),
      guid: groupGuid
    }
    await this.insertRow(row)
    return groupGuid
  }

  addGroupToLocalStorage(groupGuid: string, isAdmin: boolean): [any, string] {
    /* Add this group to the user's groups */
    /* Get current user's groups */
    let session = JSON.parse(localStorage.getItem("SessionUser"));
    let currentGroups: any[] = []
    if (session.groups) {
      currentGroups.push(JSON.parse(session.groups))
    }
    /* Add this group to local settings */
    let currentGroup = {
      guid: groupGuid,
      isAdmin: isAdmin
    }
    if (currentGroups.length == 0) {
      session.groups = JSON.stringify([currentGroup]);
    } else {
      currentGroups[0].push(currentGroup)
      session.groups = JSON.stringify(currentGroups[0]);
    }

    localStorage.setItem('SessionUser', JSON.stringify(session))
    return [session.groups, session.guid]
  }

  async addGroupToUserDynamo(accountGuid: string, currentGroups: any): Promise<void> {
    let row = {
      tableName: environment.dynamoDbTableName,
      filters: [{ field: 'groupName', operation: 'equals', value: 'login' }
        , { field: 'guid', operation: 'equals', value: accountGuid }],
      projection: ['groupName', 'userName', 'jsonObject', 'guid', 'tableName']
    }
    let res = await this.getRows(row);

    res[0].jsonObject = currentGroups; //JSON.stringify(currentGroups)

    await this.insertRow(res[0]);
  }

  async updateGroup(group: IGroup): Promise<void> {
    let row = <IDynamorow>{
      tableName: environment.dynamoDbTableName,
      groupName: group.groupName,
      userName: "General",
      households: group.houseHolds,
      jsonObject: JSON.stringify(group),
      guid: group.guid
    }
    await this.insertRow(row)
  }

  generateMatches(body: any): any {
    const url = this.apiUrl + '/generateMatches';
    return this.http.post(url, body, { responseType: 'json' }).toPromise();
  }

}
