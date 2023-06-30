//import { testcaseName } from "./cypress/e2e/src/Specs/TFSAPiintegration.cy";

// code coverage
const path = require('path')
const { defineConfig } = require("cypress");
const { ClientSecretCredential} = require("@azure/identity");
const { SecretClient } = require("@azure/keyvault-secrets");
const axios = require('axios');
const fs = require('fs');
function readFileContents(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, null, (error, data) => {
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });

  });

}
const axiospng = async (imgloc) => {
  var main_loc = './cypress/screenshots/' + imgloc
  console.log(main_loc)
  let file = await readFileContents(main_loc)

  let config = {

    method: 'post',
    url: 'https://augusta-coderepo.com/Client_Project_2023/Paradigm_Adva_Pro//_apis/wit/attachments?fileName=imageAsFileAttachment.png&api-version=6.0',
    headers: {

      'Content-Type': 'application/octet-stream',
      'Authorization': 'Basic OmV0anM0Y2k3Ymh2aXBiZDVqYXJ1MmJiZGliajZndWpzeWFnYzdqYzJtcmZwb2hkb2twdWE='
    },
    data: file
  };

  var result = await axios.request(config).then((response) => {
    return response.data.url
  })

  console.log("config", config)
  console.log("Restu = ", result)
  return result
};


const getmethod_secret = async() => {
    //method 2 
    const tenantId='21dd4b96-0304-436c-add3-23f63e5fc806',
    clientId='79924e7d-6401-4cb7-92c1-da6afaa74adf',
    //clientId='065a923d-f87c-4474-ae7f-46c135ca44b7',
    clientSecret='jL68Q~RPnmpgzFNEx_G9o8GgdNzIOHbhUObCJaga'
    const firstCredential = new ClientSecretCredential( tenantId, clientId, clientSecret);
    const keyVaultName = 'psninside-dev-kv';

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
      },
      get_file: (imgloc: string) => {
        return axiospng(imgloc)
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



