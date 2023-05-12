// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.



export const environment = {
  production: false,

  urlFirebase: 'https://beapp-501d1-default-rtdb.firebaseio.com/',

  urlLogin: 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=',

  urlGetUser: 'https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=',

  //urlFiles: 'http://localhost/sistemas-angular/marketplace/src/assets/img/',

  urlFiles :'https://github.com/jasorglez/be/blob/main/img/',

  adminFiles: 'http://localhost/sistemas-angular/marketplace/src/assets/img/index.php?key=',

  deleteFiles:'http://localhost/sistemas-angular/marketplace/src/assets/img/delete.php?key=',

  urlRefreshToken: 'https://securetoken.googleapis.com/v1/token?key=',
};




/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.


