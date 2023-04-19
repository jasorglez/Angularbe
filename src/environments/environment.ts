// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  urlFirebase: 'https://tiendas-13868-default-rtdb.europe-west1.firebasedatabase.app/',
  urlLogin: 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAinumxU4a1zPNG4Qbsh1noPWiQBjDQ-IA',
  urlGetUser: 'https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=AIzaSyAinumxU4a1zPNG4Qbsh1noPWiQBjDQ-IA',
  //urlFiles: 'http://localhost/sistemas-angular/marketplace/src/assets/img/',
  urlFiles :'https://github.com/jasorglez/be/blob/main/img/',
  adminFiles: 'http://localhost/sistemas-angular/marketplace/src/assets/img/index.php?key=AIzaSyAinumxU4a1zPNG4Qbsh1noPWiQBjDQ-IA',
  deleteFiles:'http://localhost/sistemas-angular/marketplace/src/assets/img/delete.php?key=AIzaSyAinumxU4a1zPNG4Qbsh1noPWiQBjDQ-IA',
  urlRefreshToken: 'https://securetoken.googleapis.com/v1/token?key=AIzaSyAinumxU4a1zPNG4Qbsh1noPWiQBjDQ-IA',

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
