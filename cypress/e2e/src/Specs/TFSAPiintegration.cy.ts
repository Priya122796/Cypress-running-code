

import { Selector } from "../page-objects/Selectors";
import * as fs from 'fs';
//import { getPointIDfromAzure } from "../page-objects/Automation";


//const fileContent = fs.readFileSync(file1);
let planID : any, suitID : any, testcasecount : any
let index=0;
let testcaseID_List :any
let pointID_List : any 
var  pointID : any ,runID: any ,resultID:any
 const testcaseName = new Map();

    var auth="basic_auth"
// //testing the entire functions 
//     describe('testing the methods',()=>{
//       it('Testing it ',()=>{
//        cy.writeFile('cypress/fixtures/tfs/test2.json','[')
//        get_testplan_details()
//        cy.writeFile('cypress/fixtures/tfs/test2.json',']',{flag:'a+'})
//       })
//     })
const getselector=function(objname):string {
  const array2 = Object.keys(Selector).map((key) => ({ key , value: Selector[key] }));
  for(let j in array2){
   if(array2[j].key==(objname)){
    //cy.log("***Value of  : "+objname+" is : "+array2[j].value)
    return array2[j].value;  
  } 
}
}


 export const get_testplan_details=()=>{
  cy.log("Printing inside get_testplan_details")
    cy.request({
      method:'GET',
      url:'https://paradigmoutcomes.visualstudio.com/Network%20and%20Operations/_apis/test/plans/108846?api-version=5.0',
        headers: {
          authorization: getselector(auth)
        },
  }).then(response => {
     expect(response.status).to.equal(200)
     planID=response.body.id
     cy.log("Testplan Name : "+ response.body.name+ " Planid  : "+ planID)
     get_testsuite_details(planID)
     
    }) 
    
}


  
  //GET https://dev.azure.com/{organization}/{project}/_apis/test/Plans/{planId}/suites/{suiteId}?api-version=5.0
const get_testsuite_details=(planID)=> {
      
    cy.request({
      method:'GET',
      url:'https://paradigmoutcomes.visualstudio.com/Network%20and%20Operations/_apis/test/plans/'+planID+'/suites?api-version=5.0',
        headers: {
          authorization: getselector(auth)
        },
  }).then(response => {
     expect(response.status).to.equal(200)
     var arraylength = response.body.value.length
     cy.log(response.body)
     console.log("The lenght of the body is : "+arraylength)
    expect(response.body.value[375].name).to.contains("Login,Logout and Client Regression Automation")
     suitID=response.body.value[375].id  
    //  cy.log(suitID)
     cy.writeFile('cypress/fixtures/sampleFile.xlsx','PlanID'+'\t'+'SuiteID'+'\n')
     cy.writeFile('cypress/fixtures/sampleFile.xlsx',planID+'\t'+suitID ,{flag : 'a+'})
     get_testcaseID_List(planID,suitID)
    })
   
   }

  //GET https://dev.azure.com/{organization}/{project}/_apis/test/Plans/{planId}/suites/{suiteId}/testcases?api-version=5.0
   const get_testcaseID_List=(planID,suitID) =>{
    cy.request({
      method:'GET',         
      url:'https://paradigmoutcomes.visualstudio.com/Network%20and%20Operations/_apis/test/plans/'+planID+'/suites/'+suitID+'/testcases?api-version=5.0',
        headers: {
          authorization: getselector(auth)
        },
  }).then(response => {
     expect(response.status).to.equal(200)
     testcaseID_List= response.body.value[0].testCase.id
     testcasecount= response.body.count  
     cy.log("The first case id is : \n"+testcaseID_List +"\n The total testcases in suite is \n "+testcasecount)
     cy.log(response.body.value[1].testCase.id)
     testcaseID_List=[testcasecount]
    while(index<testcasecount){
       testcaseID_List[index]=response.body.value[index].testCase.id
      cy.log("The testcase id are : "+testcaseID_List[index])
      index++;
      
     }
     get_testCaseName_iteration(planID,suitID,testcaseID_List)
  })
  
}

 const  get_testCaseName_iteration=( planID,suitID,testcaseID_List)=> {
  
      index=0;
      testcaseID_List.forEach(id_element => {
      cy.request({
        method:'GET',
        //GET https://dev.azure.com/{organization}/{project}/_apis/testplan/Plans/{planId}/Suites/{suiteId}/TestCase/{testCaseId_ListtestcaseID_List}?api-version=7.0
        url:'https://paradigmoutcomes.visualstudio.com/Network%20and%20Operations/_apis/testplan/Plans/'+planID+'/suites/'+suitID+'/testcase/'+id_element+'?api-version=7.0',
          headers: {
            authorization: getselector(auth)
          },
    }).then(response => {
      expect(response.status).to.equal(200)
      //checking the id against response 
      expect(id_element).to.equal((response.body.value[0].workItem.id).toString())
    testcaseName.set(id_element,response.body.value[0].workItem.name)
    cy.log("inside testcaseName field ",testcaseName.get(id_element))
    // cy.readFile('cypress/fixtures/test2.json').then((data) => {
    //   data.test_name=testcaseName.get(id_element)
    //  cy.writeFile('cypress/fixtures/test2.json',  JSON.stringify(data),{flag:'a+'})
    // })
    cy.writeFile('cypress/fixtures/tfstestsuite.json', { test_id: id_element , test_name : testcaseName.get(id_element)}, {flag:'a+'})
    index=index+1
    if(index<testcaseID_List.length)
    cy.writeFile('cypress/fixtures/tfstestsuite.json',",",{flag:'a+'})
    })
   
  })
  
}

 export const UpdateStatusintoTFS=(description,status,ob1,filename)=>{
  //getting planid and suiteid from json
 cy.log("###################Description  is : "+ description)
  cy.log(description+  "**************\n the status of the testcase is : "+status)
  var temp
  cy.fixture('tfsdetails').then((json) => {
   planID=json[0].PlanID
   suitID=json[0].SuiteID  
   })   
   cy.fixture('tfstestsuite').then((json) => {
    for(let j in json){
      if(description.toString().includes(json[j].test_name.toString())){
        cy.log(json[j].test_name)
        //getting point iD to initiate Create Run method 
        getPointIDfromAzure(json[j].test_id,status,planID,suitID).then((response)=>{
         pointID=response
         cy.log("The pointID is : "+pointID)
         //creating run using pointID to get runid for the each cases in respective plan
         createRun(pointID,planID,description,status,filename)
        })
      }
    }
   }) 
}
const getPointIDfromAzure=(testcaseID,status,planID,suitID)=>{
  //getting testcaseID from TFS using description
  cy.log("The testcase id is "+testcaseID+"\n Status is : "+status)
  //getting Pointid from azure API
  return cy.request({
    method:'GET',
    //https://paradigmoutcomes.visualstudio.com/Network%20and%20Operations/_apis/test/plans/872/suites/921/points?testcaseId=928&api-version=5.1
    url:'https://paradigmoutcomes.visualstudio.com/Network%20and%20Operations/_apis/test/plans/'+planID+'/suites/'+suitID+'/points?testcaseID='+testcaseID+'&api-version=5.1',
    headers: {
        authorization: getselector(auth)
      },
}).then(response => {
  expect(response.status).to.equal(200)
  console.log ("the point id is : "+response.body.value[0].id)
  return response.body.value[0].id
})
}


const createRun= (pointID,planID,description,status,filename)=>{
  //https://paradigmoutcomes.visualstudio.com/Network%20and%20Operations/_apis/test/runs?api-version=7.0
   cy.request({
     method:'POST',
     url : 'https://paradigmoutcomes.visualstudio.com/Network%20and%20Operations/_apis/test/runs?api-version=7.0',
     headers: {
        authorization: getselector(auth)
      },
     body :
     {
        "name": description+" "+new Date(),
        "plan": {
          "id": planID
         },
        "pointIds": [
          pointID   
        ]
      }
  }).then(response=>{
    expect(response.status).to.equal(200)
     cy.log(response.body.id)
     runID=response.body.id
     //Getting testresult id through runID
      gettestResultID(runID).then((result)=>{
        resultID=result
        cy.log("the result id is : "+resultID)
        //Updating Status Passed or Failed into TFS PATCH Call
       updateResult(runID,resultID,status,description,filename)
      })
     
  })
}

const gettestResultID= (runID)=>{
   return cy.request({
    method:'GET',
    ////https://paradigmoutcomes.visualstudio.com/Network%20and%20Operations/_apis/test/Runs/80/results?api-version=7.0
    url:'https://paradigmoutcomes.visualstudio.com/Network%20and%20Operations/_apis/test/Runs/'+runID+'/results?api-version=7.0',
      headers: {
        authorization: getselector(auth)
      },
}).then(response => {
   expect(response.status).to.equal(200)
   console.log ("the result id is : "+response.body.value[0].id)
  resultID= response.body.value[0].id
  return resultID
})
}

const updateResult= (runID,resultID,status,description,filename)=>{
var comment 
var bugid
//When Case is passed 
  if(status.toString()==="PASSED"){
    comment="Execution successful"
    cy.request({
      method:'PATCH',
      //PATCH https://dev.azure.com/{organization}/{project}/_apis/test/Runs/{runId}/results?api-version=7.0
      url:'https://paradigmoutcomes.visualstudio.com/Network%20and%20Operations/_apis/test/Runs/'+runID+'/results?api-version=7.0',
        headers: {
          authorization: getselector(auth)
        },
        body:[
          {
            "id": resultID.toString(),
            "outcome":status.toString(),
            "state": "Completed",
            "comment": comment.toString()
          }
          ]
  }).then(response => {
    expect(response.status).to.equal(200)
    cy.log("Execution is completed in PASSED result status ")
  })
  }// when case is failed creating bug and mapping it results of testcaserun
  else if(status.toString()==="FAILED"){
  //  createBug(description,filename)
    cy.task('getUserData').then((userData : string) => {
      // bugid=userData
      // cy.log("The bug id is : "+bugid)
    comment="Execution Failed!!!"
    cy.request({
      method:'PATCH',
      //PATCH https://dev.azure.com/{organization}/{project}/_apis/test/Runs/{runId}/results?api-version=7.0
      url:'https://paradigmoutcomes.visualstudio.com/Network%20and%20Operations/_apis/test/Runs/'+runID+'/results?api-version=7.0',
        headers: {
          authorization: getselector(auth)
        },
        body:[
          {
            "id": resultID.toString(),
            "outcome":status.toString(),
            "state": "Completed",
            "comment": comment.toString(),
        }
          ]
  }).then(response => {
    expect(response.status).to.equal(200)
    cy.log("Execution is completed in FAILED  results status ")


  })
    })
    
   }else{// when testcase is not run state status changed to paused 
    comment="Execution Paused!"
    cy.request({
      method:'PATCH',
      //PATCH https://dev.azure.com/{organization}/{project}/_apis/test/Runs/{runId}/results?api-version=7.0
      url:'https://paradigmoutcomes.visualstudio.com/Network%20and%20Operations/_apis/test/Runs/'+runID+'/results?api-version=7.0',
        headers: {
          authorization: getselector(auth)
        },
        body:[
          {
            "id": resultID.toString(),
            "outcome":status.toString(),
            "state": "Completed",
            "comment": comment.toString()
          }
          ]
  }).then(response => {
    expect(response.status).to.equal(200)
    cy.log("Execution is completed in Paused results status ")
  })
  }


}

const createBug=(description,filename)=>{
  cy.log("Bug is getting created for "+description)
  cy.request({
    method:'POST',
    url:'https://paradigmoutcomes.visualstudio.com/Network%20and%20Operations/_apis/wit/workitems/$Bug?api-version=7.0',
      headers: {
        authorization: getselector(auth),
        'Content-Type':'application/json-patch+json'
      },
      body:[
      {
          "op": "add",
          "path": "/fields/System.Title",
          "from": null,
          "value": description.toString()
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
}).then(response => {
  expect(response.status).to.equal(200)
  cy.log("The bug id is : "+response.body.id)
  cy.task('setUserData', response.body.id.toString()) 
//  create_attachment(description,filename)
})
}
  

const create_attachment=(description,filename)=>{
  cy.log("Creating attachment with filename  "+filename)
 const file1='/cypress/fixtures/Sampleimage.png'
 cy.log("Location of the file :"+file1)
 cy.readFile(file1, 'binary').then((fileContent) => {
  //const fileContent = fs.readFileSync('/cypress/fixtures/Sampleimage.png')
 // filename='Failed screenshot14.Entering Address - Fieldname - address.png'
  //cy.fixture('Sampleimage.png').then( image => {
  // cy.fixture('Sampleimage.png','binary').then( image => {
  //   const blob = new Blob([image], { type: 'image/png' });
    const blob = Cypress.Blob.binaryStringToBlob(fileContent, 'image/png');
    const formData = new FormData();
  //  cy.log(blob.toString())
    formData.append('', blob, fileContent  );
  cy.request({
    method:'POST',
    url:'https://paradigmoutcomes.visualstudio.com/Network%20and%20Operations//_apis/wit/attachments?fileName=imageAsFileAttachment.png&api-version=6.0',
   //encoding: 'binary',
      headers: {
        authorization: getselector(auth),
        'Content-Type':'application/octet-stream'
      },
     body:fileContent,
  })
}).then(response => {
    cy.log("The Attachment url is  : "+response.body.url)
    //cy.log(response.body)
  })
 
}
// const fs = require('fs');

// // Read the binary file and get its content as a Buffer
// const filePath = '/path/to/binary/file.bin';
// const fileContent = fs.readFileSync(filePath);

// // Create the attachment
// cy.request({
//   method: 'POST',
//   url: 'https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Storage/storageAccounts/{storageAccountName}/fileServices/{fileServiceName}/shares/{shareName}/directories/{directoryPath}/files/{fileName}?api-version=2021-02-01',
//   headers: {
//     'Authorization': 'Bearer yourAccessToken',
//     'Content-Type': 'application/octet-stream'
//   },
//   body: fileContent
// })
// .then((response) => {
//   // Handle the response
//   // For example, check the status code
//   expect(response.status).to.eq(201);
// });