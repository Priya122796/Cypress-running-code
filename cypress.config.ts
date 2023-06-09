//import { testcaseName } from "./cypress/e2e/src/Specs/TFSAPiintegration.cy";

// code coverage
const path = require('path')
const { defineConfig } = require("cypress");
// const { cloudPlugin } = require("cypress-cloud/plugin");

// module.exports = defineConfig({
//   e2e: {
//     // ...
//     setupNodeEvents(on, config) {
//       //= alternative: activate the plugin first
//       cloudPlugin(on, config)
//       const enhancedConfig = {
//         projectId:'ImXQ98',
//         env: {
//           // preserve the original env
//           ...config.env,
//           customVariable: "value"
//         }
//       }
//       return cloudPlugin(on, enhancedConfig);
//     },
//   },
// });
// module.exports = defineConfig({
//   // setupNodeEvents can be defined in either
//   // the e2e or component configuration
//   e2e: {
//     setupNodeEvents(on, config) {
//       require('@cypress/code-coverage/task')(on, config)
//       // include any other plugin code...

//       // It's IMPORTANT to return the config object
//       // with any changed environment variables
//       return config
//     },
//   },
// })
// Path to Excel file
// Read the Excel file
 // Select first workbook
// Convert the workbook to JSON
// Set the debug point
// Output the data to the console
function getDataFromHtmlWatchlistIntoJson() {
  const XLSX = require("xlsx");

  const filePath = path.resolve(__dirname, "TestcaseSuite.xlsx")
 
  const workbook = XLSX.readFile(filePath);

  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
 
  const jsonData = XLSX.utils.sheet_to_json(worksheet);

  console.log(jsonData);
  return jsonData
}
function getTFSdetailsIntoJson() {
  const XLSX = require("xlsx");

  const filePath = path.resolve(__dirname, "cypress/fixtures/sampleFile.xlsx")
 
  const workbook = XLSX.readFile(filePath);

  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
 
  const jsonData = XLSX.utils.sheet_to_json(worksheet);

  console.log(jsonData);
  return jsonData
 
}


import allureWriter from "@shelex/cypress-allure-plugin/writer"
module.exports = defineConfig({
 
  projectId: 'yb6s1t',
  defaultCommandTimeout: 5000,
  e2e: {
   trashAssetsBeforeRuns : true,
    baseUrl : 'https://naveenautomationlabs.com/opencart/',
    //Wont run automatically on every save when watch for file changes is false 
    watchForFileChanges : true,
    "allureResultsPath": "allure/results",
    //experimentalSessionSupport : true,
    // testIsolation: false,
    experimentalRunAllSpecs : true,
    setupNodeEvents(on, config) {
  //   require("@cypress/code-coverage/task")(on, config);
         on('task', {
        readXlsxFile() {
          return getDataFromHtmlWatchlistIntoJson()
        },
        readTfsDetails(){
          return getTFSdetailsIntoJson()
        },
        setUserData: (userData:string) => {
          global.userData = userData;
          return "description is set !!!!!!!!";
        },
        getUserData: () => {
          return global.userData;
        },
      });
      allureWriter(on, config);
      // on("file:preprocessor", require("@cypress/code-coverage/use-babelrc"));
       return config;
    },
    env: {
      allure: true,
      allureReuseAfterSpec: true
  }
  },
  
});



