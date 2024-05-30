import utils from './1sat_utils.cjs';


let ISSUER_PRIVATE_KEY;
let ISSUER_ADDRESS;
let ISSUER_PUBLIC_KEY;
const API_KEY = "<<YOUR TAAL API HERE>>"
let PROJECT_UID;
let UTXO_LIST;
let TX_OBJ;
let TRANSACTION_UID;
let OUTPUT_LIST = [];
let TXID = '';
let COLLECTION_ID='';
let jsonResponse;
let options;
let faucet_needed = true;

const STEPS_TO_TEST =['single', 'collection'];
//const STEPS_TO_TEST =['1.1','1.2','1.3','1.4','1.5', '1.6', '1.7'];
//const STEPS_TO_TEST =['2.1','2.2','2.3','2.4','2.5', '2.6', '2.7', '2.8', '2.9'];


const STANDALONE_PROJECT = {projectType :'single', isFungible:true, protocol: 'OneSatOrdinal'}
const COLLECTION_PROJECT = {projectType :'collection', isFungible:true, protocol: 'OneSatOrdinal'}


//Use Case 1 - Standalone 1Sat Token
console.log('\x1b[33m%s\x1b[0m',"Step 1.0 Setup Standalone Project")
await setupProject();

//Step 1.1 - Create STANDALONE Project
if(shouldTestThis('1.1')){
  console.log('\x1b[33m%s\x1b[0m',"Step 1.1 - Create STANDALONE Project")
  await createProject(STANDALONE_PROJECT)
  .then((jsonResponse ) => { 
  });  
}

if(shouldTestThis('1.2')){
  //Step 1.2 - get Project Details
  console.log('\x1b[33m%s\x1b[0m',"Step 1.2 - get Project Details")
  options = utils.REST_options("get_details", API_KEY);
  options.path = options.path.replace("{projectUid}", PROJECT_UID)

  await utils.REST_request(options, null).then((axiosResponse) => {
    jsonResponse = axiosResponse.data;})
  checkResponse(jsonResponse,null);
}

if(shouldTestThis('1.3')){
  //Step 1.3 - get list of projects
  console.log('\x1b[33m%s\x1b[0m',"Step 1.3 - get list of projects")
  await utils.REST_request(utils.REST_options("list_projects", API_KEY)
  , null).then((axiosResponse) => {
    jsonResponse = axiosResponse.data;})
  checkResponse(jsonResponse,null);
}

if(shouldTestThis('1.4')){
  //Step 1.4 - create a single output for a standalone token
  console.log('\x1b[33m%s\x1b[0m',"Step 1.4 - create a single output for a standalone token")
  await createOutput({"type":'single', "id":null}, 
  utils.textInscription, 200).then((data) => {
    jsonResponse = data;})
}
  
if(shouldTestThis('1.5')){
  //Step 1.5 - get list of project outputs
  console.log('\x1b[33m%s\x1b[0m',"Step 1.5 - get list of project outputs")
  await getOutputsList().then((data) => {
  jsonResponse = data;})
  //console.log(jsonResponse['data']['outputList'])
}

if(shouldTestThis('1.6')){
  //Step 1.6 - Create Transaction
  console.log('\x1b[33m%s\x1b[0m',"Step 1.6 - Create Transaction")
  await createTransaction().then((data) => {
      jsonResponse = data;})
  //console.log(JSON.stringify(jsonResponse))
}

if(shouldTestThis('1.7')){
  //Step 1.7 - Submit Transaction
  console.log('\x1b[33m%s\x1b[0m',"Step 1.7 - Submit Transaction")
  await submitTransaction(null, null).then((data) => {
      jsonResponse = data;})

  if(jsonResponse['success']){
      TXID = jsonResponse['data']['txId'];
      console.log(TXID);
  }
  

}

//Use Case 2 - Collection 1Sat Tokens
if(shouldTestThis('2.1')){
  //Step 2.1 - Create COLLECTION Project
  console.log('\x1b[33m%s\x1b[0m',"Step 2.1 - Create COLLECTION Project")
  await createProject(COLLECTION_PROJECT)
  .then((jsonResponse ) => {});
}
if(shouldTestThis('2.2')){
  //Step 2.2 - create a collection output
  console.log('\x1b[33m%s\x1b[0m',"Step 2.2 - create a collection output")
  await createOutput({"type":'collection', "id":null}, 
  utils.imageInscription, 200).then((data) => {
    jsonResponse = data;})
}

if(shouldTestThis('2.3')){
  //Step 2.3 - get list of project outputs
  console.log('\x1b[33m%s\x1b[0m',"Step 2.3 - get list of project outputs")
  await getOutputsList().then((data) => {
    jsonResponse = data;})
    //console.log(jsonResponse['data']['outputList'])  
}

if(shouldTestThis('2.4')){
  //Step 2.4 - Create Transaction
  console.log('\x1b[33m%s\x1b[0m',"Step 2.4 - Create Transaction")
  await createTransaction().then((data) => {
    jsonResponse = data;})

}

if(shouldTestThis('2.5')){
  //Step 2.5 - Submit Transaction (Collection)
  console.log('\x1b[33m%s\x1b[0m',"Step 2.5 - Submit Transaction (Collection)")
  await submitTransaction(null, null).then((data) => {
    jsonResponse = data;})

  if(jsonResponse['success']){
    COLLECTION_ID = jsonResponse['data']['txId'] +"_0";
    console.log(COLLECTION_ID);
  }
}

if(shouldTestThis('2.6')){
  //Step 2.6 - create a collectionItem output
  console.log('\x1b[33m%s\x1b[0m',"Step 2.6 - create a collectionItem output")
  await createOutput({"type":'collectionItem', "id":null}, 
  utils.textInscription, 200).then((data) => {
    jsonResponse = data;})
}

  
if(shouldTestThis('2.7')){
  //Step 2.7 - get list of project outputs
  console.log('\x1b[33m%s\x1b[0m',"Step 2.7 - get list of project outputs")
  await getOutputsList().then((data) => {
    jsonResponse = data;})
}

if(shouldTestThis('2.8')){
  //Step 2.8 - Create Transaction
  console.log('\x1b[33m%s\x1b[0m',"Step 2.8 - Create Transaction")
  await createTransaction().then((data) => {
    jsonResponse = data;})

}

if(shouldTestThis('2.9')){
  //Step 2.9 - Submit Transaction (CollectionItem)
  console.log('\x1b[33m%s\x1b[0m',"Step 2.9 - Submit Transaction (CollectionItem)")
  await submitTransaction(null, null).then((data) => {
    jsonResponse = data;})

  if(jsonResponse['success']){
    TXID = jsonResponse['data']['txId'];
    console.log(TXID);
  }

}
  
/*FUNCTIONS*/

async function createProject(
    {projectType :ptype, isFungible:isFung, protocol: prot} ){
    
        const options = utils.REST_options("create_project", API_KEY);
        let payload = utils.create_project()
        payload ['type'] = ptype
        payload ['isFungible'] = isFung
        payload ['tokenProtocol'] = prot
    
        let postData = JSON.stringify(payload);
        console.log(postData)
    
        let jsonResponse
        await utils.REST_request(options, postData).then((axiosResponse) => {
          jsonResponse = axiosResponse.data;})
        
          PROJECT_UID = jsonResponse['data']['projectUid']

        return checkResponse(jsonResponse);
    
    }   
    

async function createOutput(outputType, inscription){
    
    const options = utils.REST_options("create_output", API_KEY);
    let body = utils.create_output();
    body["projectUid"] = PROJECT_UID;
    body["metadata"]["subType"] = outputType["type"];
    body["contentType"] = inscription()['content-type'];
    body["b64File"] = inscription()['content'];
    
    let cid
    if (outputType["type"]!='single'){
      if (outputType["id"]!=null){
        cid = outputType["id"]
      }else{
        cid = COLLECTION_ID
      }
      body["metadata"]["subTypeData"] = JSON.stringify(
        {"collectionId": `${cid}`, "description":"description123"}
      )   
    }
    
    
    let jsonResponse
    await utils.REST_request(options, JSON.stringify(body)).then((axiosResponse) => {
      jsonResponse = axiosResponse.data;})

    return checkResponse(jsonResponse);
    
  }

  async function getOutputsList(){
    const options = utils.REST_options("list_outputs", API_KEY);
    options.path = options.path.replace("{projectUid}", PROJECT_UID)
    let jsonResponse
    //Reinitialize outputlist
    OUTPUT_LIST = [];

    await utils.REST_request(options, null).then((axiosResponse) => {
      jsonResponse = axiosResponse.data;})
      
      if(jsonResponse['data']['outputList']){
        for (var i=0; i<jsonResponse['data']['outputList'].length;i++){
          //Add only those outputs that have not been used yet
          if(jsonResponse['data']['outputList'][i]["transactionUid"]==null){
            OUTPUT_LIST.push(jsonResponse['data']['outputList'][i]["uid"]);
          }  
          
        }
        //console.log(JSON.stringify(jsonResponse));
  
      }
      return checkResponse(jsonResponse);
  }


  
  async function createTransaction(){

    const options = utils.REST_options("create_transaction", API_KEY);
    let body = utils.create_transaction();
    body["projectUid"] = PROJECT_UID;
    body["publicKey"]  = ISSUER_PUBLIC_KEY;
    body["dstAddress"] = ISSUER_ADDRESS;
    body["outputList"] = OUTPUT_LIST;

    //Get funds if needed and update the utxo list
    if(faucet_needed){
      UTXO_LIST = await utils.getFundsFromFaucet(
        ISSUER_ADDRESS
      );
      faucet_needed = false;
  
    }else{
      UTXO_LIST = await utils.getNextUTXO(
        ISSUER_ADDRESS
      );  
    }
    

    for(var i=0; i<UTXO_LIST.length;i++){
      body["utxoList"][i]["txId"] = UTXO_LIST[i]["txid"];  
      body["utxoList"][i]["outputIndex"] = UTXO_LIST[i]["vout"];  
    }

    console.log(JSON.stringify(body))
    let jsonResponse
    await utils.REST_request(options, JSON.stringify(body)).then((axiosResponse) => {
      jsonResponse = axiosResponse.data;})
    
    if(jsonResponse['success']){
      TX_OBJ = jsonResponse['data']['txObj'];
      TRANSACTION_UID = jsonResponse['data']['transactionUid'];
      console.log(TRANSACTION_UID)
    }
    
    
    return checkResponse(jsonResponse);

    
  }
  
  async function submitTransaction(){
    const options = utils.REST_options("submit_transaction", API_KEY);
    let body = utils.submit_transaction();
    body["transactionUid"] = TRANSACTION_UID;
    body["tx"] = utils.Transaction(TX_OBJ).sign(ISSUER_PRIVATE_KEY).toString("hex");
        
    let jsonResponse
    await utils.REST_request(options, JSON.stringify(body)).then((axiosResponse) => {
      jsonResponse = axiosResponse.data;})

    
    //console.log(JSON.stringify(body))
    return checkResponse(jsonResponse, body);
  }


  async function setupProject() {
    ISSUER_PRIVATE_KEY = utils.PrivateKey();
    ISSUER_ADDRESS = ISSUER_PRIVATE_KEY.toAddress('testnet').toString();
    ISSUER_PUBLIC_KEY = ISSUER_PRIVATE_KEY.publicKey.toString();
    console.log("Public key:" + ISSUER_PUBLIC_KEY)
    console.log("Address   :" + ISSUER_ADDRESS)


  }

  function shouldTestThis(step){
    
    if (STEPS_TO_TEST.indexOf(step)>-1){
      return true;
    }else if(STEPS_TO_TEST.indexOf('single')>-1 && step.indexOf('1.')>-1){
      return true;
    }else if(STEPS_TO_TEST.indexOf('collection')>-1 && step.indexOf('2.')>-1){
      return true;
    }else{
      console.log('\x1b[33m%s\x1b[0m',"Skipping: " + step)
      return false;
    }

  }

  function checkResponse(jsonResponse, body){
    console.log(jsonResponse["success"])
    if (!jsonResponse['success']){
      console.log(JSON.stringify(jsonResponse))
      console.log(JSON.stringify(body))
      throw new Error('Something went wrong')
    }
    return jsonResponse;
  }