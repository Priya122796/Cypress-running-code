

import { Selector } from "../page-objects/Selectors";
//import { getPointIDfromAzure } from "../page-objects/Automation";

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
      url:'https://augusta-coderepo.com/Client_Project_2023/Paradigm_Adva_Pro/_apis/test/plans/872?api-version=5.0',
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
      url:'https://augusta-coderepo.com/Client_Project_2023/Paradigm_Adva_Pro/_apis/test/plans/'+planID+'/suites?api-version=5.0',
        headers: {
          authorization: getselector(auth)
        },
  }).then(response => {
     expect(response.status).to.equal(200),
     expect(response.body.value[2].name).to.equal("Testscript integration")
     suitID=response.body.value[2].id  
     cy.log(suitID)
     cy.writeFile('cypress/fixtures/sampleFile.xlsx','PlanID'+'\t'+'SuiteID'+'\n')
     cy.writeFile('cypress/fixtures/sampleFile.xlsx',planID+'\t'+suitID ,{flag : 'a+'})
     get_testcaseID_List(planID,suitID)
    })
   
   }

  //GET https://dev.azure.com/{organization}/{project}/_apis/test/Plans/{planId}/suites/{suiteId}/testcases?api-version=5.0
   const get_testcaseID_List=(planID,suitID) =>{
    cy.request({
      method:'GET',         
      url:'https://augusta-coderepo.com/Client_Project_2023/Paradigm_Adva_Pro/_apis/test/plans/'+planID+'/suites/'+suitID+'/testcases?api-version=5.0',
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
        url:'https://augusta-coderepo.com/Client_Project_2023/Paradigm_Adva_Pro/_apis/testplan/Plans/'+planID+'/suites/'+suitID+'/testcase/'+id_element+'?api-version=7.0',
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

 export const UpdateStatusintoTFS=(description,status,ob1)=>{
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
         createRun(pointID,planID,description,status)
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
    //https://augusta-coderepo.com/Client_Project_2023/Paradigm_Adva_Pro/_apis/test/plans/872/suites/921/points?testcaseId=928&api-version=5.1
    url:'https://augusta-coderepo.com/Client_Project_2023/Paradigm_Adva_Pro/_apis/test/plans/'+planID+'/suites/'+suitID+'/points?testcaseID='+testcaseID+'&api-version=5.1',
    headers: {
        authorization: getselector(auth)
      },
}).then(response => {
  expect(response.status).to.equal(200)
  console.log ("the point id is : "+response.body.value[0].id)
  return response.body.value[0].id
})
}


const createRun= (pointID,planID,description,status)=>{
  //https://augusta-coderepo.com/Client_Project_2023/Paradigm_Adva_Pro/_apis/test/runs?api-version=7.0
   cy.request({
     method:'POST',
     url : 'https://augusta-coderepo.com/Client_Project_2023/Paradigm_Adva_Pro/_apis/test/runs?api-version=7.0',
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
       updateResult(runID,resultID,status,description)
      })
     
  })
}

const gettestResultID= (runID)=>{
   return cy.request({
    method:'GET',
    ////https://augusta-coderepo.com/Client_Project_2023/Paradigm_Adva_Pro/_apis/test/Runs/80/results?api-version=7.0
    url:'https://augusta-coderepo.com/Client_Project_2023/Paradigm_Adva_Pro/_apis/test/Runs/'+runID+'/results?api-version=7.0',
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

const updateResult= (runID,resultID,status,description)=>{
var comment 
var bugid
//When Case is passed 
  if(status.toString()==="PASSED"){
    comment="Execution successful"
    cy.request({
      method:'PATCH',
      //PATCH https://dev.azure.com/{organization}/{project}/_apis/test/Runs/{runId}/results?api-version=7.0
      url:'https://augusta-coderepo.com/Client_Project_2023/Paradigm_Adva_Pro/_apis/test/Runs/'+runID+'/results?api-version=7.0',
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
    createBug(description)
    cy.task('getUserData').then((userData : string) => {
      bugid=userData
      cy.log("The bug id is : "+bugid)
    comment="Execution Failed!!!"
    cy.request({
      method:'PATCH',
      //PATCH https://dev.azure.com/{organization}/{project}/_apis/test/Runs/{runId}/results?api-version=7.0
      url:'https://augusta-coderepo.com/Client_Project_2023/Paradigm_Adva_Pro/_apis/test/Runs/'+runID+'/results?api-version=7.0',
        headers: {
          authorization: getselector(auth)
        },
        body:[
          {
            "id": resultID.toString(),
            "outcome":status.toString(),
            "state": "Completed",
            "comment": comment.toString(),
            "associatedBugs": [
            {
              "id": bugid.toString()
            }
          ]
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
      url:'https://augusta-coderepo.com/Client_Project_2023/Paradigm_Adva_Pro/_apis/test/Runs/'+runID+'/results?api-version=7.0',
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

const createBug=(description)=>{
  cy.log("Bug is getting created for "+description)
  cy.request({
    method:'POST',
    url:'https://augusta-coderepo.com/Client_Project_2023/Paradigm_Adva_Pro/_apis/wit/workitems/$Bug?api-version=7.0',
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
})
}
  


 

