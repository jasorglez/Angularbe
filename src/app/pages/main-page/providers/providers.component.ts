import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GooglesheetsService } from 'src/app/services/googlesheets.service';

@Component({
  selector: 'app-providers',
  template: `
  <div *ngIf="data">
    <p>{{ data.values[2][2] }}</p> <!-- A3 cell -->
    <p>{{ data.values[7][1] }}</p> <!-- B8 cell -->
  </div>
`,
  styleUrls: ['./providers.component.css']
})

export class ProvidersComponent implements OnInit {

  data : any;

  constructor(private sheetsService : GooglesheetsService) { }

  ngOnInit() {
    this.sheetsService.getSheetData().subscribe
       (data => {
            this.data = data ;
       }) ;
  }



}
