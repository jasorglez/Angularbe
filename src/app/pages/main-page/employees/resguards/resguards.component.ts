import { Component, OnInit, Inject } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder } from '@angular/forms';

import { Iresguard } from 'src/app/interface/iresguard';
import { alerts } from 'src/app/helpers/alerts';


@Component({
  selector: 'app-resguards',
  templateUrl: './resguards.component.html',
  styleUrls: ['./resguards.component.css']
})
export class ResguardsComponent implements OnInit {

  showNewForm: boolean = false;

  resguardDataSource!: MatTableDataSource<Iresguard>;
  screenSizeSM = false;
  resguards: Iresguard[] = [];
  loadData = false;

  displayedColresguards: string[] = ['numberposition', 'number', 'date',  'actions'];

  constructor(
    private formBuilder: FormBuilder,

  ) { }



  public fresg = this.formBuilder.group({
    quantity: [''],
    Date: '',
    name: [''],
    comment: ['']
  });

  ngOnInit() {
    //this.ge
  }

  newResg(){

  }

  showNewFormOverlay() {
    this.showNewForm = !this.showNewForm;
  }

  getDataEmployees() {
    // Agrega lógica para obtener datos después de cerrar el diálogo
  }

  onSubmit() {
    // Handle form submission logic here

    // Optionally, you can reset the form after submission
    this.fresg.reset();
    this.showNewForm = false; // Hide the form after submission
  }

  applyFilter(dataSource: MatTableDataSource<any>, event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    dataSource.filter = filterValue.trim().toLowerCase();

    if (dataSource.paginator) {
      dataSource.paginator.firstPage();
    }
  }
}

