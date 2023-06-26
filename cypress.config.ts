//import { testcaseName } from "./cypress/e2e/src/Specs/TFSAPiintegration.cy";

// code coverage
const path = require('path')
const { defineConfig } = require("cypress");
const { ClientSecretCredential} = require("@azure/identity");
const { SecretClient } = require("@azure/keyvault-secrets");

const getmethod_secret = async() => {
  //const tenantId=process.env.TENANT_ID, clientId=process.env.CLIENT_ID,clientSecret=process.env.CLIENT_SECRET
  //augusta
 // const tenantId='1da53bfb-aa20-4fa2-bb8b-65e1f2516714', clientId='15dfb74b-9965-4d96-a2f3-c226aebd69d2',clientSecret='uqB8Q~7u42mlkdcsC38VI.uKvjIQQWSM0q8Lgdg9'
//parad  
  const tenantId='21dd4b96-0304-436c-add3-23f63e5fc806',
  clientId='065a923d-f87c-4474-ae7f-46c135ca44b7',
  clientSecret='v898Q~TqIFnh25SYOQ2VwGBkDyJ1zZ039K8P3cE.'
  const firstCredential = new ClientSecretCredential( tenantId, clientId, clientSecret);
  const keyVaultName = 'psninside-dev-kv';
  //const keyVaultName = 'Advaprokeyvault';
  console.log(keyVaultName)
 if (!keyVaultName) throw new Error("KEY_VAULT_NAME is empty");
  const url = "https://" + keyVaultName + ".vault.azure.net";
 // const url ="https://psninside-dev-kv.vault.azure.net/"
  const client = new SecretClient(url, firstCredential);
  try{
    // GETTING SECRET 
    const secret = await client.getSecret("OpsAdvaQAAutomation");
  // const secret = await client.getSecret("username");
    console.log("The secret value is :"+secret.value);
    return secret.value
  }catch(err){
    console.log("Err:"+err)
    return err
  } finally{
   console.log("got secret ")
  }
}
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
 
  e2e: {
    
   trashAssetsBeforeRuns : true,
    //Wont run automatically on every save when watch for file changes is false 
    watchForFileChanges : true,
    "defaultCommandTimeout": 7000,
    //experimentalSessionSupport : true,
    // testIsolation: false,
    "experimentalModifyObstructiveThirdPartyCode":true,
    "allureResultsPath": "allure/results",
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
        get_secret:()=>{
         console.log("Get_secret task")
          return  getmethod_secret()
      }
      });
      allureWriter(on, config);
      // on("file:preprocessor", require("@cypress/code-coverage/use-babelrc"));
       return config;
    },
    env: {
      allure: true,
      allureReuseAfterSpec: true
    },
 
  
  },
});



