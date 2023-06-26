//This is spec file, inside your google-search.spec.ts
import {GoogleSearch} from "../page-objects/Automation";
import { generateEmployees } from "../page-objects/Fakerdata";
import {get_testplan_details} from "./TFSAPiintegration.cy";

const search = new GoogleSearch();
let testcaseName : any
const dataTransfer = new DataTransfer();
describe('Redirected to naveen automation labss', () => {

     beforeEach('Generating faker data everytime ',()=>{
      //    cy.log("Executing Before each 1. Generating faker data json dynamically " )
      //    let dataObj = generateEmployees(10);
      //   cy.writeFile("./cypress/fixtures/fakerdata.json",JSON.stringify(dataObj, null, '\t'));
      //    cy.log("*Executing before each 2. Fetching tfs testcases details*")
      //  cy.writeFile('cypress/fixtures/tfs/test2.json','[')
      //   get_testplan_details()
      //   cy.writeFile('cypress/fixtures/tfs/test2.json',']',{flag:'a+'})

      //   cy.task('readTfsDetails').then((fileContents) => {
      //     const jsonData =fileContents;
      //   // yeilded data from xlsx is dynamic creation into json file 
      //     cy.writeFile(
      //       "./cypress/fixtures/TFSdetails.json",
      //       JSON.stringify(jsonData, null, 4),
      //       "utf-8"
      //     );
      //     cy.log("Written into json");
      //   });
       
     })
    it('Google Search', () => {
        cy.log('inside it ')
      cy.task('get_secret').then((element:string) => {
       cy.log("Secret value is : "+element)
      })
      cy.log('completed')
  })

});

