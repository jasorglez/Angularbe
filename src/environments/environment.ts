// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.



export const environment = {
  firebase: {
    projectId: 'beapp-501d1',
    appId: '1:151993360357:web:127db5b6d20896fb84990c',
    databaseURL: 'https://beapp-501d1-default-rtdb.firebaseio.com',
    storageBucket: 'beapp-501d1.appspot.com',
    locationId: 'us-central',
    apiKey: 'AIzaSyDxCBGKk8nT09hdW85-PyOkhw5_JPZLF1A',
    authDomain: 'beapp-501d1.firebaseapp.com',
    messagingSenderId: '151993360357',
  },

  production: false,

  urlFirebase: 'https://beapp-501d1-default-rtdb.firebaseio.com/',

  urlLogin: 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDxCBGKk8nT09hdW85-PyOkhw5_JPZLF1A',

  urlGetUser: 'https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=AIzaSyDxCBGKk8nT09hdW85-PyOkhw5_JPZLF1A',

  urlFiles: 'gs://beapp-501d1.appspot.com',

  urlProfile :'https://firebasestorage.googleapis.com/v0/b/beapp-501d1.appspot.com/o/images%2Fprofile.png?alt=media&token=b7e9886b-59d9-43da-9c8e-f91017225b8d',

  adminFiles: 'http://localhost/sistemas-angular/marketplace/src/assets/img/index.php?key=AIzaSyDxCBGKk8nT09hdW85-PyOkhw5_JPZLF1A',

  deleteFiles:'http://localhost/sistemas-angular/marketplace/src/assets/img/delete.php?key=AIzaSyDxCBGKk8nT09hdW85-PyOkhw5_JPZLF1A',

  urlRefreshToken: 'https://securetoken.googleapis.com/v1/token?key=AIzaSyDxCBGKk8nT09hdW85-PyOkhw5_JPZLF1A',
};



/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.


