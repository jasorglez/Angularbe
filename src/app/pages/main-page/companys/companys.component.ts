import { Component, OnInit } from '@angular/core';
import { Observable, filter, forkJoin, map, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-companys',
  templateUrl: './companys.component.html',
  styleUrls: ['./companys.component.css']
})
export class CompanysComponent implements OnInit{
     data$ = of (1,2,48,5);
     numbers = of (28,44,59,5, 3, 21, 2,4,98) ;

     combinedData: any[] = [];

     constructor(private http:HttpClient ) { }

     ngOnInit(): void {

          this.exampletap()
          this.examplemap();
          this.examplemapwithfillter() ;

          this.getCompaniesPermission().subscribe(response => {
            const [permissions, companies] = response;
            this.combinedData = this.combineData(permissions, companies);
            console.log("JOIN", this.combinedData)
          }, error => {
            console.error(error);
          });

     }

     exampletap() {
        this.data$
        .pipe(
         map((number) => number * number),
         tap((result: number) => console.log('tap',result))

        )
        .subscribe();
     }

     examplemap() {

      const numb =  this.data$.pipe(
       map(number => number * 21)

       ) ;
       numb.subscribe(result => console.log('map', result))
      }

      examplemapwithfillter() {

        const numb =  this.numbers.pipe(
         filter(number => number % 2 ===0) ) ;
         numb.subscribe(result => console.log('Filter', result))
        }


        getCompaniesPermission(): Observable<any> {

          const permissionsUrl = `${environment.urlFirebase}permissionsxcompanys.json`;
          const companyUrl = `${environment.urlFirebase}companys.json`;

           const permissions$ = this.http.get(permissionsUrl);
           const company$ = this.http.get(companyUrl);

           return forkJoin([permissions$, company$]);

        }


        combineData(permissions: { [key: string]: any }, companies: { [key: string]: any }): any[] {
          // Filtrar los permisos por el email deseado
          const filteredPermissions = Object.values(permissions).filter((permission: any) => permission.email === 'jsoriano@hco-consultores.com');

          // Combina los datos según tu lógica de negocio
          // Puedes utilizar loops, map, filter u otras funciones de array para combinar los datos

          // Ejemplo de combinación por id_company
          return filteredPermissions.map((permission: any) => {
            const companyId = permission.id_company;
            const company = companies[companyId];

            return {
              permission,
              company
            };
          });
        }


}
