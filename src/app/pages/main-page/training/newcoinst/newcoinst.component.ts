import { Component, Inject, OnInit } from '@angular/core';

import { AbstractControl, FormBuilder, ValidationErrors, Validators } from '@angular/forms';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { StoragesService } from 'src/app/services/storages.service';

import { TrackingService } from 'src/app/services/tracking.service';

import { InstructorsService } from 'src/app/services/instructors.service';
import { TrainingService } from 'src/app/services/training.service';
import { EmployeesService } from 'src/app/services/employees.service';

import { Icourse } from 'src/app/interface/icourses';
import { Iinstructors } from 'src/app/interface/iinstructors';
import { Istuxemp } from 'src/app/interface/istuxemp';

import { alerts } from 'src/app/helpers/alerts';
import { StudentsService } from '../../../../services/students.service';


@Component({
  selector: 'app-newcoinst',
  templateUrl: './newcoinst.component.html',
  styleUrls: ['./newcoinst.component.css']
})
export class NewcoinstComponent implements OnInit {

  instructorsList  : any[] = [];
  employeesList    : any[] = [] ;

  selectedFile1: File;
  selectedFile2: File;
  selectedFile3: File;
  selectedFile4: File;
  selectedFile5: File;
  selectedFile6: File;

  selectedFile8: File;
  selectedFile9: File;

  url  : string = '' ;
  url2 : string = '' ;
  url3 : string = '' ;

  formSubmitted = false;
  loadData = false;

  public fcourses = this.formBuilder.group({
    name        : [, [Validators.required]],
    dates       : '',
    datee       : '',
    instructor  : [],
    place       : [, [Validators.required]],
    schedule    : [],
    description : [, [Validators.required]],

 } )

 public finstructors = this.formBuilder.group({
  name          : [, [Validators.required]],
  phone         : '',
  email         : '',
  address       : [],
  rfc           : [, [Validators.required]],
  program       : [, [Validators.required]],
  speciality    : [, [Validators.required]],
  invoice       : [, [Validators.required]],
  qualification : [0]

} )

public fstudents = this.formBuilder.group({
  name          : [''],
  email         : [, [Validators.required]],
  rfc           : [, [Validators.required]],
  qualification : ['', [Validators.required, Validators.pattern("^[0-9]*$"), this.maxValue(10)]]

} )



  constructor( private trackingService    : TrackingService,
               private trainingService    : TrainingService,
               private instructorsService : InstructorsService,
               private studentsService    : StudentsService,
               private employeesService   : EmployeesService,
               private formBuilder: FormBuilder,
               private storageServ: StoragesService,
               public dialogRef: MatDialogRef<NewcoinstComponent >,
               @Inject(MAT_DIALOG_DATA) public data: any) { }


  ngOnInit() {

    if (this.data.formType === 'fcourses')  { this.getInstructors();  }

    if (this.data.formType === 'fstudents')  { this.getEmployees();  }

    this.setDates() ;

  }


  setDates() {
    const today = new Date();
    const thirtyDaysLater = new Date();
    thirtyDaysLater.setDate(today.getDate() + 30);

    this.fcourses.patchValue({
      dates: this.formatDate(today),
      datee: this.formatDate(thirtyDaysLater),
    });
  }

  formatDate(date: Date): string {
    const day = ("0" + date.getDate()).slice(-2);
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();

    return `${year}-${month}-${day}`;
  }


  maxValue(max: number): (control: AbstractControl) => ValidationErrors | null {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      return value > max ? { 'maxValue': { max, actual: value } } : null;
    };
    }


  getInstructors() {
    //aqui voy a pasar lo que tengo en los combo box de Instructors
    this.instructorsService.getIns2fields(localStorage.getItem('company'))
    .then(dataInstructors  => {
       this.instructorsList = dataInstructors;
      // console.log(this.instructorsList)
    }, error => {
      console.error('Error:', error);
    });
  }

  getEmployees() {
    //aqui voy a pasar lo que tengo en los combo box de Employees
    this.employeesService.get2field(localStorage.getItem('company'))
    .then(dataEmployees  => {
       this.employeesList = dataEmployees;
      // console.log(this.employeesList)
    }, error => {
      console.error('Error:', error);
    });
  }


  onEmployeeChange(event: Event) {
    const selectedName = (event.target as HTMLInputElement).value ;

    const selectedEmployee = this.employeesList.find(employee => employee.name === selectedName);

    if (selectedEmployee) {
      this.fstudents.get('email').setValue(selectedEmployee.email);
    }
  }



  getCourses() {
      //aqui voy a pasar lo que tengo en los combo box de Instructors
      this.trainingService.getCour2fields(localStorage.getItem('project'))
      .then(dataInstructors  => {
         this.instructorsList = dataInstructors;
        // console.log(this.instructorsList)
      }, error => {
        console.error('Error:', error);
      });
   }


   async saveCourses() {

          this.loadData = true;

          this.formSubmitted = true;

          await this.saveFilesCourses() ;

             const dataCourses: Icourse = {
                    name          : this.fcourses.controls.name.value,
                    dStart        : new Date(this.fcourses.get('dates').value),
                    dEnd          : new Date(this.fcourses.get('datee').value),
                    description   : this.fcourses.controls.description.value,
                    file1         : this.url,
                    file2         : this.url2,
                    file3         : this.url3,
                    instructor    : this.fcourses.controls.instructor.value ?? '',
                    id_project    : this.trackingService.getProject(),
                    place         : this.fcourses.controls.place.value ?? '',
                    schedule      : this.fcourses.controls.schedule.value ?? '',

               }

               this.loadData = false;

               this.trainingService.post(dataCourses, localStorage.getItem('token')).subscribe(
                (resp: any) => { // Indicar que la respuesta es de tipo 'any'

                    this.dialogRef.close('save');
                  },
                      err=>{
                             alerts.basicAlert("Error", 'User saving error', "error")
                      }
               );

  }

  selectFile1(event : any) {

    this.selectedFile1 = event.target.files[0];
  }

  selectFile2(event : any) {
    this.selectedFile2 = event.target.files[0];
  }

  selectFile3(event : any) {
    this.selectedFile3 = event.target.files[0];
  }

  async saveFilesCourses() {
    if (this.selectedFile1) {
      try {
        this.url = await this.storageServ.uploadPdf(this.selectedFile1);
       // console.log('Download URL for file 1:', this.url);
      } catch (error) {
        console.error('Upload error for file 1:', error);
      }
    }

    if (this.selectedFile2) {
      try {
        this.url2 = await this.storageServ.uploadPdf(this.selectedFile2);
        //console.log('Download URL for file 2:', this.url2);
      } catch (error) {
        console.error('Upload error for file 2:', error);
      }
    }

    if (this.selectedFile3) {
      try {
        this.url3 = await this.storageServ.uploadPdf(this.selectedFile3);
        //console.log('Download URL for file 3:', this.url3);
      } catch (error) {
        console.error('Upload error for file 3:', error);
      }
    }
  }



  selectFile4(event : any) {

    this.selectedFile4 = event.target.files[0];
  }

  selectFile5(event : any) {
    this.selectedFile5 = event.target.files[0];
  }

  selectFile6(event : any) {
    this.selectedFile6 = event.target.files[0];
  }




  async saveFilesInstructors() {

    if (this.selectedFile4) {
      try {
        this.url = await this.storageServ.uploadPdf(this.selectedFile4);
       // console.log('Download URL for file 1:', this.url);
      } catch (error) {
        console.error('Upload error for file 4:', error);
      }
    }

    if (this.selectedFile5) {
      try {
        this.url2 = await this.storageServ.uploadPdf(this.selectedFile5);
        //console.log('Download URL for file 2:', this.url2);
      } catch (error) {
        console.error('Upload error for file 5:', error);
      }
    }

    if (this.selectedFile6) {
      try {
        this.url3 = await this.storageServ.uploadPdf(this.selectedFile6);
        //console.log('Download URL for file 3:', this.url3);
      } catch (error) {
        console.error('Upload error for file 6:', error);
      }
    }
  }



  async saveInstructors() {

      this.loadData = true;

      this.formSubmitted = true;

      await this.saveFilesInstructors() ;

         const dataInstructors: Iinstructors = {
                active        : 1,
                address       : this.finstructors.get('name').value,
                email         : this.finstructors.get('email').value,
                invoice       : this.finstructors.get('invoice').value,
                id_company    : localStorage.getItem('company'),
                id_course     : '',
                file1         : this.url,
                file2         : this.url2,
                file3         : this.url3,
                name          : this.finstructors.get('name').value,
                phone         : this.finstructors.get('phone').value,
                program       : this.finstructors.get('program').value,
                rfc           : this.finstructors.get('rfc').value,
                speciality    : this.finstructors.get('speciality').value,
                qualification : this.finstructors.get('qualification').value,
           }

           this.loadData = false;

           this.instructorsService.post(dataInstructors, localStorage.getItem('token')).subscribe(
            (resp: any) => { // Indicar que la respuesta es de tipo 'any'

                this.dialogRef.close('save');
              },
                  err=>{
                         alerts.basicAlert("Error", 'User saving error', "error")
                  }
           );

}


selectFile8(event : any) {
  this.selectedFile8 = event.target.files[0];
}

selectFile9(event : any) {
  this.selectedFile9 = event.target.files[0];
}



async saveFilesStudents() {

  if (this.selectedFile8) {
    try {
      this.url = await this.storageServ.uploadPdf(this.selectedFile8);
     // console.log('Download URL for file 1:', this.url);
    } catch (error) {
      console.error('Upload error for file 4:', error);
    }
  }

  if (this.selectedFile9) {
    try {
      this.url2 = await this.storageServ.uploadPdf(this.selectedFile9);
      //console.log('Download URL for file 2:', this.url2);
    } catch (error) {
      console.error('Upload error for file 5:', error);
    }
  }

}



async saveStudents() {
  this.loadData = true;

  this.formSubmitted = true;

  await this.saveFilesStudents() ;

     const dataStudents: Istuxemp = {
            active        : 1,
            id_course     : this.data.profileId,
            constance     : this.url,
            evaluation    : this.url2,
            name          : this.fstudents.get('name')?.value,
            qualification: Number(this.fstudents.get('qualification')?.value),

       }

       this.loadData = false;

       this.studentsService.post(dataStudents, localStorage.getItem('token')).subscribe(
        (resp: any) => { // Indicar que la respuesta es de tipo 'any'

            this.dialogRef.close('save');
          },
              err=>{
                     alerts.basicAlert("Error", 'User saving error', "error")
              }
       );

}


}
