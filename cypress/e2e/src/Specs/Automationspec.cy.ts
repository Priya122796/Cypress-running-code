//This is spec file, inside your google-search.spec.ts


//const search = new GoogleSearch();
let testcaseName: any
const dataTransfer = new DataTransfer();
describe('Redirected to naveen automation labss', () => {

  beforeEach('Generating faker data everytime ', () => {
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
    //     cy.visit('/')
    //     search.firstsearch().type('Samsung')
    //     search.searchandenter().type('HTC Touch{enter}');
    //     search.searchResultswithTimeout().type('ipod nano{enter}')
    //     search.containscheck().within(($form) =>{
    //            cy.get('.dropdown-menu').find('button[name="GBP"]').click()    
    //     })
    //     search.currencycheck().find('.price').should('contain','£');
    //     //hovering 
    //     search.mousemovement().trigger('mouseover','center').click();
    //     //drag and drop sample website https://x2f9rh.csb.app/?standalone   and   https://simple-drag-drop.glitch.me/
    //     let val=0;
    //     while(val!=2){
    //     search.drag().scrollIntoView().trigger('dragstart', {
    //         dataTransfer
    //       });
    //     search.drop().trigger('drop', {
    //         dataTransfer
    //     })
    //    ++val;
    cy.log('Inside it ')
    cy.task('get_secret').then((element: string) => {
      cy.log(element)
    })
    cy.log('after secret call ')

    cy.log("testing the file attachment upload")
    cy.task('get_file', "Failed screenshot Login-To Verify that Successfully landed user role-based landing page, when user Clicking on the Adva pro Login button Fieldname - url.png").then((element: string) => {
      cy.log(element)
    })


    var filename = "Failed screenshot Login-To Verify that Successfully landed user role-based landing page, when user Clicking on the Adva pro Login button Fieldname - url.png" 
    cy.log(filename + ":Creating attachment with filename")
    cy.task('get_file', filename).then((attachmenturl: String) => {
      cy.log("The attachment url is : " + attachmenturl)
      var a1 = attachmenturl
      let data = JSON.parse(JSON.stringify([
        {
          "op": "add",
          "path": "/fields/System.History",
          "value": "Screenshot attached "
        },
        {
          "op": "add",
          "path": "/relations/-",
          "value": {
            "rel": "AttachedFile",
            "url": a1,
            "attributes": {
              "comment": " Screenshot attached "
            }
          }
        }
      ]));
      cy.request({
        method: 'PATCH',
        url: 'https://augusta-coderepo.com/Client_Project_2023/Paradigm_Adva_Pro/_apis/wit/workitems/1863?api-version=7.0',
        //encoding: 'binary',
        headers: {
          authorization: 'Basic OmV0anM0Y2k3Ymh2aXBiZDVqYXJ1MmJiZGliajZndWpzeWFnYzdqYzJtcmZwb2hkb2twdWE=',
          'Content-Type': 'application/json-patch+json'
        },
        body: data
      }).then(response => {
        cy.log("The bug is   : " + response.body.id)
        //cy.log(response.body)
      })
    })


    // }
    // createbug().then((resp=>{
    //   cy.log(resp+"The bug id is ")
    // }))
  });

  //  https://augusta-coderepo.com/Client_Project_2023/Paradigm_Adva_Pro/_apis/wit/workitems/$Bug?api-version=7.0
  
});

