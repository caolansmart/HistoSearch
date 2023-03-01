import {read, utils} from './xlsx.js';

var preloader = document.getElementById("preloader");


// --- EVENT LISTENERS FOR SEARCH BUTTON --- //

const button = document.getElementById("button");
const input = document.getElementById("input");

button.addEventListener("click", SearchForKeyword);


// --- DATA CONNECT TO EXCEL SHEET -- //

let workbook;
let worksheet;
let specimenTypes;

(async() => {
  const excelUrl = "HistoSearch DataSet To db.xlsx";
  const data = await (await fetch(excelUrl)).arrayBuffer();
  /* data is an ArrayBuffer */
  workbook = read(data);

  console.log(workbook);

  console.log(workbook.Sheets["Data"]);
  
  worksheet = workbook.Sheets["Data"];

  specimenTypes = utils.sheet_to_json(worksheet);

  console.log(specimenTypes);
})();



// --- FUNCTION TO SEARCH FOR KEYWORD --- //

function SearchForKeyword(){
  
  let resultList = new Array(0);

  let resultDescList = new Array(0);

  let resultSubTypeList = new Array(0);
  
  var keywordCount = new Object();

  var keyword = " " + document.getElementById("input").value;
  
  console.log(keyword);

  RemoveResults();

  let topMatch = document.createElement("p");
  let topMatchText = document.createTextNode("Top Match!");
  let topMatchImg = document.createElement("img");
  let topMatchBalancer = document.createElement("p");
  let topMatchBalancerText = document.createTextNode("");


  topMatch.appendChild(topMatchText);
  topMatch.className ="top-match";

  topMatchImg.src = "images/gold-medal.png";

  topMatchImg.className = "gold-medal";

  topMatchBalancer.appendChild(topMatchBalancerText);
  topMatchBalancer.className = "balancer";

  let max = 0;
  let maxSpecimenType = "";

  
  // Get specimenType with highest count of keyword //
  for (let specimenType of specimenTypes){

    keywordCount[specimenType.specimenTypeCode] = specimenType.clinicalDetails.split(keyword.toLowerCase()).length + specimenType.clinicalDetails2.split(keyword.toLowerCase()).length;


    if(keywordCount[specimenType.specimenTypeCode]> max){

      max = keywordCount[specimenType.specimenTypeCode];
      maxSpecimenType = specimenType.specimenTypeCode;

    }
    console.log(specimenType.specimenTypeCode);
    console.log("Count = " + keywordCount[specimenType.specimenTypeCode]);

  }

  // Get all specimenTypes that contain keyword //
  for (let specimenType of specimenTypes){

    if ((specimenType.clinicalDetails.includes(keyword.toLowerCase()) || specimenType.clinicalDetails2.includes(keyword.toLowerCase())) && (keyword !== "")){
      
      if ((keyword.toLowerCase() == "cystectomy") && (specimenType.specimenTypeCode == "GB")){
        maxSpecimenType = "BLADRES";
      }
      else{
        if (max > 10 && max / keywordCount[specimenType.specimenTypeCode] > 4){

        }
        else{
          resultList.push(specimenType.specimenTypeCode);
          resultDescList.push(specimenType.specimenTypeDesc);
          resultSubTypeList.push(specimenType.specimenSubType);
        }
      }

    }
    else{}
  
  }  

  
  console.log("Results: " + resultList);
  console.log("Top Match: " + maxSpecimenType);
  console.log("No of occurences: " + max);


  // Update page with results //
  try{
    for(let i=1; i<resultList.length+1; i++){
      
      let codeElementTopMatch = document.getElementById("result0-code");
      let codeDescElementTopMatch = document.getElementById("result0-desc");
      let subTypeElementTopMatch = document.getElementById("result0-subtype");

      
        if (resultList[i-1] == maxSpecimenType){

          document.getElementById("result0").style.backgroundColor="gold";
          
          codeElementTopMatch.innerHTML=resultList[i-1];
          codeDescElementTopMatch.innerHTML=resultDescList[i-1];
          subTypeElementTopMatch.innerHTML=resultSubTypeList[i-1];

          codeElementTopMatch.parentNode.insertBefore(topMatch, codeElementTopMatch);
  
          topMatch.parentNode.insertBefore(topMatchImg, topMatch);
          
          let oldResultElement = document.getElementById("result" + i);
          let oldResultDataElement = document.getElementById("result" + i + "-data");
          oldResultElement.style.height="0px";
          oldResultElement.style.margin = "0 0 0 0";
          oldResultDataElement.style.height = "0px";

          GetSubTypeColor(0, resultSubTypeList[i-1]);
        }
        else{
          try{
            let codeElement = document.getElementById("result" + i + "-code");
            let codeDescElement = document.getElementById("result" + i + "-desc");
            let subTypeElement = document.getElementById("result" + i + "-subtype");
  
            document.getElementById("result" + i).style.backgroundColor="rgb(207, 231, 252)";
  
            codeElement.innerHTML=resultList[i-1];
            codeDescElement.innerHTML=resultDescList[i-1];
            subTypeElement.innerHTML=resultSubTypeList[i-1];

          }
          catch{
            console.log("Over page element limit(10)")
          }

          GetSubTypeColor(i, resultSubTypeList[i-1]);
        }
    }
  }
  catch{
    console.log("Error updating DOM.")
  }
  

  // if no results //
  if (resultList.length < 1){
    
    let result1DivElem = document.getElementById("result1");
    let noResultsElem = document.createElement("p");
    let noResultsText = document.createTextNode("No results");
    noResultsElem.appendChild(noResultsText);
    noResultsElem.className = "no-results";
    result1DivElem.insertAdjacentElement("beforebegin", noResultsElem);
  }

}



// --- FUNCTION TO CLEAR PAGE FROM PREVIOUS SEARCH --- //

function RemoveResults(){

  for(let j=0; j<=13; j++){

    let resultDivs = document.getElementsByClassName("result");
    let resultDataDivs = document.getElementsByClassName("result-data");

    for (let resultDiv of resultDivs){
      resultDiv.style.height = "50px";
      resultDiv.style.margin = "15px 0 15px 0";
    }

    for (let resultDataDiv of resultDataDivs){
      resultDataDiv.style.height = "50px";
    }

    try{
      document.getElementById("result" + j + "-code").innerHTML = "";
      document.getElementById("result" + j + "-desc").innerHTML="";
      document.getElementById("result" + j + "-subtype").innerHTML="";
      document.getElementById("result" + j).style.backgroundColor="";
      document.getElementById("result" + j + "-subtype").style.backgroundColor="";
    }
    catch{}

    let a = document.getElementsByClassName("top-match");
    let b = document.getElementsByClassName("gold-medal");
    let c = document.getElementsByClassName("balancer");
    let d = document.getElementsByClassName("no-results");

    try{
      a[0].parentNode.removeChild(a[0]);
      b[0].parentNode.removeChild(b[0]);
      c[0].parentNode.removeChild(c[0]);
      console.log("removed child"+a[0].value, b[0].value, c[0].value);

    }
    catch{
      console.log("Could not remove child");
    }

    try{
      d[0].parentNode.removeChild(d[0]);
    }
    catch{
      console.log("Could not remove 'No-results' element");
    }
  }
}

// --- FUNCTION TO GET COLOUR OF SUBTYPE --- //

function GetSubTypeColor(resultNo, subType){
  switch(subType){
    case "BREAST":
      document.getElementById("result" + resultNo + "-subtype").style.color="rgb(252,228,214)";
      console.log("orange");
      break;
    case "BST":
      document.getElementById("result" + resultNo + "-subtype").style.color="rgb(217,217,217)";
      console.log("grey");
      break;
    case "CVS":
      document.getElementById("result" + resultNo + "-subtype").style.color="rgb(112,48,160)";
      console.log("purple");
      break;
    case "ENDOCRINE":
      document.getElementById("result" + resultNo + "-subtype").style.color="rgb(26,239,218)";
      console.log("green");
      break;
    case "GI":
      document.getElementById("result" + resultNo + "-subtype").style.color="rgb(0,176,240)";
      console.log("blue");
      break;
    case "GYNAE":
      document.getElementById("result" + resultNo + "-subtype").style.color="rgb(255,102,255)";
      console.log("pink");
      break;
    case "HAEM":
      document.getElementById("result" + resultNo + "-subtype").style.color="rgb(255,0,0)";
      console.log("red");
      break;
    case "HNOP":
      document.getElementById("result" + resultNo + "-subtype").style.color="rgb(153,204,255)";
      console.log("lightblue");
      break;
    case "HPB":
      document.getElementById("result" + resultNo + "-subtype").style.color="rgb(255,255,0)";
      console.log("yellow");
      break;
    case "NPATH":
      document.getElementById("result" + resultNo + "-subtype").style.color="rgb(255,242,204)";
      console.log("lightgoldenrodyellow");
      break;
    case "SKIN":
      document.getElementById("result" + resultNo + "-subtype").style.color="rgb(112,173,71)";
      console.log("green");
      break;
    case "THORACIC":
      document.getElementById("result" + resultNo + "-subtype").style.color="rgb(255,192,0)";
      console.log("lightsalmon");
      break;
    case "UROLOGY":
      document.getElementById("result" + resultNo + "-subtype").style.color="rgb(68,84,106)";
      console.log("darkblue");
      break;
    case "IMF":
      document.getElementById("result" + resultNo + "-subtype").style.color="rgb(255,0,0)";
      console.log("red");
      break;
  }
}
