// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl: "http://localhost:5000/api/v1/",
  firebase: {
    apiKey: "AIzaSyBzGJOfmVklbDzlRlrcd_nnNN8gxup1mdc",
    authDomain: "scheduler-50762.firebaseapp.com",
    projectId: "scheduler-50762",
    storageBucket: "scheduler-50762.appspot.com",
    messagingSenderId: "877045269744",
    appId: "1:877045269744:web:313866e177020ab318ae35",
    measurementId: "G-80SMRPH5PH",
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
