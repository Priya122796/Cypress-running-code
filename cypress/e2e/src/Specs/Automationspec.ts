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
    cy.visit('/')
    search.firstsearch().type('Samsung')
    search.searchandenter().type('HTC Touch{enter}');
    search.searchResultswithTimeout().type('ipod nano{enter}')
    search.containscheck().within(($form) =>{
           cy.get('.dropdown-menu').find('button[name="GBP"]').click()    
    })
    search.currencycheck().find('.price').should('contain','£');
    //hovering 
    search.mousemovement().trigger('mouseover','center').click();
    //drag and drop sample website https://x2f9rh.csb.app/?standalone   and   https://simple-drag-drop.glitch.me/
    let val=0;
    while(val!=2){
    search.drag().scrollIntoView().trigger('dragstart', {
        dataTransfer
      });
    search.drop().trigger('drop', {
        dataTransfer
    })
   ++val;
}
createbug().then((resp=>{
  cy.log(resp+"The bug id is ")
}))
    });

  //  https://augusta-coderepo.com/Client_Project_2023/Paradigm_Adva_Pro/_apis/wit/workitems/$Bug?api-version=7.0
  const createbug=()=>{
    var params =[
      {
          "op": "add",
          "path": "/fields/System.Title",
          "from": null,
          "value": "Automation BUG"
      },
      {
          "op": "add",
          "path": "/fields/System.State",
          "from": null,
          "value": "New"
      },
      {
          "op": "add",
          "path": "/fields/Microsoft.VSTS.Scheduling.Effort",
          "from": null,
          "value": "1"

      },{
          "op": "add",
          "path": "/fields/Microsoft.VSTS.Scheduling.BugOwner",
          "from": null,
          "value": "Nifaanya Priya"

      },{
          "op": "add",
          "path": "/fields/Microsoft.VSTS.Scheduling.DevOwner",
          "from": null,
          "value": "Nifaanya Priya"

      },{
          "op": "add",
          "path": "/fields/Microsoft.VSTS.Common.Priority",
          "from": null,
          "value": "2"

      },
      {
          "op": "add",
          "path": "/fields/System.AssignedTo",
          "from": null,
          "value": "Nifaanya Priya"

      }       
]
   return cy.request({
      method:'POST',
    
      url:'https://augusta-coderepo.com/Client_Project_2023/Paradigm_Adva_Pro/_apis/wit/workitems/$Bug?api-version=7.0',
        headers: {
          authorization: 'Basic OjRhNWFqc2hjenBob3dkam53Y3BzbWEyNGE2emdmYWNteXZ2ajZoZHNrYTV0YXhsZnZqeWE=',
          'Content-Type':'application/json-patch+json'
        },
        body:params
  }).then(response => {
    expect(response.status).to.equal(200)
    cy.log("The bug id is : "+response.body.id)
    return response.body.id
  })
  }
});

