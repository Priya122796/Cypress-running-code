import * as requests from 'requests';
import * as json from 'json';
import * as jsonpath from 'jsonpath';
import { datetime } from 'datetime';
var organization, pat, planName, project, status, suitename, testcaseName;
organization = "YourOrganizationName";
project = "YourProjectName";
pat = "YourPAT";
planName = "YourPlanName";
suitename = "YourSuiteName";
testcaseName = "YourTestCaseName";
status = "passed";

function get_testplan_details() {
  var planID, reponsejson, response, suiteID, url;

  try {
    url = "https://dev.azure.com/" + organization + "/" + project + "/_apis/test/plans?api-version=5.0";
    response = requests.get({
      "url": url,
      "auth": ["", pat]
    });
    reponsejson = json.loads(response.text);
    planID = jsonpath.jsonpath(reponsejson, "$.value.[?(@.name == '" + planName + "')].id")[0];
    suiteID = jsonpath.jsonpath(reponsejson, "$.value.[?(@.name == '" + planName + "')].rootSuite.id")[0];
    return [planID.toString(), suiteID];
  } catch (e) {
    console.log("Something went wrong in fetching Test Plan ID :" + e.toString());
  }
}

function get_testsuite_details() {
  var plandetails, reponsejson, response, suiteID, url;

  try {
    plandetails = get_testplan_details();
    url = "https://dev.azure.com/" + organization + "/" + project + "/_apis/test/plans/" + plandetails[0] + "/suites?api-version=5.0";
    response = requests.get({
      "url": url,
      "auth": ["", pat]
    });
    reponsejson = json.loads(response.text);
    suiteID = jsonpath.jsonpath(reponsejson, "$.value.[?(@.name == '" + suitename + "')].id")[0];
    return suiteID.toString();
  } catch (e) {
    console.log("Something went wrong in fetching Test Suite ID :" + e.toString());
  }
}

function get_testcase_ID() {
  var planID, reponsejson, response, suiteID, testcaseID, url;

  try {
    planID = get_testplan_details()[0];
    suiteID = get_testsuite_details();
    url = "https://dev.azure.com/" + organization + "/" + project + "/_apis/test/plans/" + planID + "/suites/" + suiteID + "/points?api-version=5.0";
    response = requests.get({
      "url": url,
      "auth": ["", pat]
    });
    reponsejson = json.loads(response.text);
    testcaseID = jsonpath.jsonpath(reponsejson, "$..[?(@.name == '" + testcaseName + "')].id")[0];
    return testcaseID;
  } catch (e) {
    console.log("Something went wrong in fetching Test Case ID :" + e.toString());
  }
}

function get_testpoint_ID() {
//  https://augusta-coderepo.com/Client_Project_2023/Paradigm_Adva_Pro/_apis/test/plans/872/suites/921/points?testcaseID=929&api-version=5.1
  var planID, reponsejson, response, suiteID, tcID, testpointID, url;

  try {
    planID = get_testplan_details()[0];
    suiteID = get_testsuite_details();
    tcID = get_testcase_ID();
    url = "https://dev.azure.com/" + organization + "/" + project + "/_apis/test/plans/" + planID + "/suites/" + suiteID + "/points?testCaseId=" + tcID + "&api-version=5.0";
    response = requests.get({
      "url": url,
      "auth": ["", pat]
    });
    reponsejson = json.loads(response.text);
    testpointID = jsonpath.jsonpath(reponsejson, "$.value.[0].id")[0];
    return testpointID.toString();
  } catch (e) {
    console.log("Something went wrong in fetching Test Point ID :" + e.toString());
  }
}

function create_run() {
  //POST https://dev.azure.com/{organization}/{project}/_apis/test/runs?api-version=7.0
  var payload, payloadJson, planID, pointID, reponsejson, response, runID, runName, url;

  try {
    runName = planName + "-" + datetime.now().strftime("%d-%m-%Y-%H-%M-%S").toString();
    planID = get_testplan_details()[0];
    pointID = get_testpoint_ID();
    url = "https://dev.azure.com/" + organization + "/" + project + "/_apis/test/runs?api-version=5.0";
    payload = "{\"name\":\"" + runName + "\",\"plan\":{\"id\":" + planID + "},\"pointIds\":[" + pointID + "]}";
    payloadJson = json.loads(payload);
    response = requests.post({
      "url": url,
      "json": payloadJson,
      "auth": ["", pat],
      "headers": {
        "Content-Type": "application/json"
      }
    });
    reponsejson = json.loads(response.text);
    runID = jsonpath.jsonpath(reponsejson, "$.id")[0];
    return runID.toString();
  } catch (e) {
    console.log("Something went wrong in fetching Run ID :" + e.toString());
  }
}

function get_testResult_ID() {
  var reponsejson, response, resultID, runID, url;
  try {
    runID = create_run();
    url = "https://dev;.azure.com/" + organization + "/" + project + "/_apis/test/runs/" + runID + "/results?api-version=6.0-preview.6";
    response = requests.get({
      "url": url,
      "auth": ["", pat]
    });
    reponsejson = json.loads(response.text);
    resultID = jsonpath.jsonpath(reponsejson, "$.value.[0].id")[0];
    return [resultID.toString(), runID];
  } catch (e) {
    console.log("Something went wrong in fetching Result ID :" + e.toString());
  }
}

function create_bug() {
  var bugId, payload, payloadJson, response, responsejson, title, url;

  try {
    title = testcaseName + " - Failed";
    url = "https://dev.azure.com/" + organization + "/" + project + "/_apis/wit/workitems/$bug?api-version=5.0";
    payload = "[{\"op\": \"add\",\"path\": \"/fields/System.Title\",\"from\": null,\"value\": \"" + title + "\"}]";
    payloadJson = json.loads(payload);
    response = requests.post({
      "url": url,
      "json": payloadJson,
      "auth": ["", pat],
      "headers": {
        "Content-Type": "application/json-patch+json"
      }
    });
    responsejson = json.loads(response.text);
    bugId = jsonpath.jsonpath(responsejson, "$.id")[0];
    console.log(bugId);
    return bugId.toString();
  } catch (e) {
    console.log("Something went wrong in updating Test Results :" + e.toString());
  }
}

function close_bug() {
  var bugId, payload, payloadJson, queryURL, response, responsejson, title, updateURL, updatepayload, updatepayloadJson;

  try {
    title = testcaseName + " - Failed";
    queryURL = "https://dev.azure.com/" + organization + "/" + project + "/_apis/wit/wiql?api-version=6.0";
    payload = "{\"query\": \"Select [System.Id] From WorkItems Where [System.WorkItemType] = 'Bug' AND [State] = 'New' AND [System.Title] = '" + title + "' AND [Area Path] = '" + project + "'\"}";
    payloadJson = json.loads(payload);
    response = requests.post({
      "url": queryURL,
      "json": payloadJson,
      "auth": ["", pat],
      "headers": {
        "Content-Type": "application/json"
      }
    });
    responsejson = json.loads(response.text);

    if (jsonpath.jsonpath(responsejson, "$.workItems")[0].toString() !== "[]") {
      bugId = jsonpath.jsonpath(responsejson, "$.workItems[0].id")[0].toString();
      console.log("Bug ID to be closed :" + bugId);
      updateURL = "https://dev.azure.com/" + organization + "/" + project + "/_apis/wit/workitems/" + bugId + "?api-version=6.0";
      updatepayload = "[{\"op\":\"test\",\"path\":\"/rev\",\"value\":2},{\"op\":\"add\",\"path\":\"/fields/System.State\",\"value\":\"Done\"}]";
      updatepayloadJson = json.loads(updatepayload);
      requests.patch({
        "url": updateURL,
        "json": updatepayloadJson,
        "auth": ["", pat],
        "headers": {
          "Content-Type": "application/json-patch+json"
        }
      });
    }
  } catch (e) {
    console.log("Something went wrong in updating Test Results :" + e.toString());
  }
}

function update_result(status) {
  var bugid, payload, payloadJson, resp, resultID, resultdata, runID, url;

  try {
    resultdata = get_testResult_ID();
    resultID = resultdata[0];
    runID = resultdata[1];
    url = "https://dev.azure.com/" + organization + "/" + project + "/_apis/test/runs/" + runID + "/results?api-version=6.0-preview.6";

    if (status === "PASSED") {
      close_bug();
      payload = "[{ \"id\": " + resultID + ",  \"outcome\": \"" + status + "\" ,    \"state\": \"Completed\",    \"comment\": \"Execution Successful\"  }]";
    } else {
      bugid = create_bug();
      payload = "[{ \"id\": " + resultID + ",  \"outcome\": \"" + status + "\",     \"state\": \"Completed\",    \"comment\": \"Execution Failed\",\"associatedBugs\": [{\"id\":" + bugid + "}]}]";
    }

    payloadJson = json.loads(payload);
    resp = requests.patch({
      "url": url,
      "json": payloadJson,
      "auth": ["", pat],
      "headers": {
        "Content-Type": "application/json"
      }
    });
    console.log(resp.text);
  } catch (e) {
    console.log("Something went wrong in updating Test Results :" + e.toString());
  }
}

update_result(status.upper());
