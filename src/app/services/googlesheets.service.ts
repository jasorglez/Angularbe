import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class GooglesheetsService {

  private sheetId = 'YOUR_SHEET_ID'; // replace with your Google Sheet ID
  private apiKey  = 'b8117b58e631f3e7fd4eb47f9ffe93b1d865dd61'; // replace with your API key

  constructor(private http: HttpClient) { }

getSheetData(): Observable<any> {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.sheetId}/values/Sheet1?key=${this.apiKey}`;
  return this.http.get(url);
}



}
