
import {action} from  '../actionspec';
import { generateEmployees } from "../../page-objects/Fakerdata";
/// <reference types="cypress" />

const actionobj= new action();
describe("My first Test Suite ",{testIsolation:false} ,() => {
  //faker data is generated adn stored in json 
  beforeEach('Generating faker data everytime ',()=>{
    cy.log("Executing Before each" )
    let dataObj = generateEmployees(10);
    cy.writeFile("./cypress/fixtures/fakerdata.json",JSON.stringify(dataObj, null, '\t'));
  })
  it("Reading xlsx and converting into json", () => {
    // reading exc.el and coverting it into readable json through task 
    cy.task('readXlsxFile').then((fileContents) => {
      const jsonData =fileContents;
    // yeilded data from xlsx is dynamic creation into json file 
      cy.writeFile(
        "./cypress/fixtures/testData.json",
        JSON.stringify(jsonData, null, 4),
        "utf-8"
      );
      cy.log("Written into json");
    });
  });
  it('read on a json file', function(){
    //REading json and defining the calling methods 
    cy.fixture('testData').then((json) => {
    for(let j in json){
      cy.log(json[j].keyword+json[j].runmode)
    let description = json[j].description;
    let keyword =json[j].keyword;
    var data:string = json[j].data;
    var ob1:string=json[j].objectName;
    let runmode =json[j].runmode; 
    if(runmode== "yes"){    
      cy.log('*****Keyword is '+keyword)
    switch (keyword) {
      case 'openbrowser':
        cy.log('inside switch openbrowser   '+  ob1);
        actionobj.openbrowser(description,data);
        break;
    case 'click':
      cy.log('inside switch click  '+  ob1);
      actionobj.click(description,ob1 );
      break; 
    case 'type':
      cy.log('inside switch type  '+  ob1);
      actionobj.type(description,ob1,data );
      break; 
    case 'date':
        cy.log('inside switch date  '+  ob1);
        actionobj.date(description,ob1,data,keyword );
        break; 
    case 'uploadfile':
      cy.log('inside uploadfile '+ob1)
      actionobj.uploadfile(description,ob1,data,keyword);
      break;
    case 'dropdown' : 
      cy.log('inside dropdown  '+ob1)
      actionobj.dropdown(description,ob1,data,keyword)
      break;
    case 'scroll' :
      cy.log('inside dropdown  '+ob1)
      actionobj.scroll(description,ob1)

    }
  }else{
    cy.log(description + " runmode is set to  " + runmode)
  }
    //.log(j  )
  }
    })
             
    // cy.fixture('example').then((profile)=>{
      
    //   //cy.log(profile);
    //   cy.wrap(profile[1])
    //   .should('be.an','object')
    //   .and('contain',{
    //     "name": "Getting second entry",
    //     "email": "hello@cypress.io",
    //     "body": "Fixtures are a great way to mock data for responses to routes"
    //   })
    //})
  })
});

// describe('TC_01 My first read and write file suite',function(){
// it('write on a xlsx file',function(){
//     //{flag : a+} used to concat and append 
//     cy.writeFile('sampleFile.xlsx','Hello Hustler'+'\t')
//     cy.writeFile('sampleFile.xlsx',"Second message !!!!!!",{flag :'a+'})
//   //console.log(conversion());   
// })

// })

