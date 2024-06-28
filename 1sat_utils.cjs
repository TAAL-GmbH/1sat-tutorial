const axios = require('axios');
const bsv = require('bsv');
const TOKENSTUDIO_API = 'https://console.taal.com/token-studio/api/v1'
const TAAL_API_KEY = "<<YOUR TAAL API KEY HERE>>"

function createOutputBody(projectUid) {
  const timestamp = new Date().getTime().toString()

  const body = {
    "projectUid": `${projectUid}`,
    "contentType": "image/png",
    "b64File": 'b64file',
    "metadata": {
        // "app": "myCollection",
        "name": `My single token ${timestamp}`,
        // "subType": "single",
        // "subType": "collection",
        "subType": "anything",
        // "subTypeData": "{\"description\": \"this is description\" }",
        // "subTypeData": "{\"collectionId\": \"11752692a626b0728ef499242adfb71ddf830fae695499fa948117dbe5e4d648_0\" }",
        "subTypeData": "{\"description\": \"this is description\",  \"collectionId\": \"11752692a626b0728ef499242adfb71ddf830fae695499fa948117dbe5e4d648_0\"  }",
        "type": "ord",
        "description": "this is a collection description",
        // "quantity": "1",
        "info": "any info",
        "eyes": "green"
    }
};
  return body;
}


function updateOutputBody() {
  const timestamp = new Date().getTime().toString()

  const body = {
    "contentType": "text/plain",
    "b64File": "....",
    "metadata": {
      //Mandatory
      "name": "Updated output " + timestamp,
      //Optional  anything except app, type, subType and subTypeData
      "hair": "blue",
      "eyes": "brown"
      // not allowed, app, type, subType and subTypeData
    }
  }
  return body;
}

function createProjectBody() {
  const timestamp = new Date().getTime().toString()
  const body = {
    "name": `1satcol project ${timestamp}`,
    "isFungible": true,
    // "type": "collection",
    "type": "single",
    "tokenProtocol": "OneSatOrdinal"
};
  return body;
}


function createTransactionBody() {
  const body = {
    "projectUid": "{{projectUid}}",
    "publicKey": "{{publicKey}}",
    "dstAddress": "{{dstAddress}}",
    "outputList": ["{{outputList}}"],
    "utxoList": [
        {
            "outputIndex": 0,
            "txId": "{{utxo}}"
        }
    ]
  }
return body;
}

function submitTransactionBody() {
  const body = {
      "transactionUid": "{{transactionUid}}",
      "tx": "{{signedtx}}"
    }
    
return body;
}


function REST_options(step) {
  const options = {
    host: TOKENSTUDIO_API,
    path: '',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Apikey' : TAAL_API_KEY,
    },
  };
  switch(step){
    case "create_project":
      options['path'] = '/project/create';
      break;
    case "get_details":
      options['path'] = '/project/{projectUid}';
      options['method'] = 'GET';
      break;
    case "create_output":
      options['path'] = '/token/one-sat-ord/create-output';
      break;
    case "update_output":
      options['path'] = '/token/one-sat-ord/update-output/{{OUTPUTUID}}';
      options['method'] = 'PUT';

    case "list_outputs":
      options['path'] = '/project/{projectUid}/output-list';
      options['method'] = 'GET';
      break;
    case "list_projects":
       options['path'] = '/project/';
       options['method'] = 'GET';
       break;
    case "create_transaction":
       options['path'] = '/token/one-sat-ord/create-transaction'
       break;
    case "submit_transaction":
       options['path'] = '/submit'
       break;
  
  }
    return options;
}

async function REST_request(options, postData){

    const axiosRequest = {
      method: options.method,
      url: options.host + options.path,
      headers: options.headers,
    }
    console.log(axiosRequest.method + " " + axiosRequest.url);
    if(options.method == "POST"){
      axiosRequest.data = postData
    }
    
    
    const response = await axios(axiosRequest).catch(function (error) {
      return error.response;
    });;
    return response;
}

function imageInscription(){
  const fs = require('fs');
  const contents = fs.readFileSync('./TAAL_logo.png', {encoding: 'base64'})
return ({"content-type" : "image/png",
        "content" : contents
      })
}

function htmlInscription(){
  const buf = Buffer.from("<html><body>Hello World</body></html>", 'utf8');
  
  return ({"content-type":'text/html;charset=utf8', 
          "content":buf.toString("base64")  
        })
}
function textInscription(){
  
  const buf = Buffer.from('This is my text', 'utf-8');
  return ({"content-type":"'text/plain;charset=utf-8'",
          "content":buf.toString("base64")
        })
}



// the amount of satoshis in a bitcoin
const SATS_PER_BITCOIN = 1e8;

// getNextUTXO gets an address UTXOs from testnet.
async function getNextUTXO(address) {
  const url = `${WHATSONCHAIN_API_TESTNET}/address/${address}/unconfirmed/unspent`

  const response = await axios({
    method: 'get',
    url
  })
  return [{
    txid: response.data['result'][0]['tx_hash'],
    vout: response.data['result'][0]['tx_pos'],
    satoshis: bitcoinToSatoshis(response.data['result'][0]['value']),
  }]
  
}

// getTransaction gets a bitcoin transaction from testnet.
async function getTransaction(txid) {
  const url = `${WHATSONCHAIN_API_TESTNET}/tx/hash/${txid}`

  const response = await axios({
    method: 'get',
    url
  })

  return response.data
}

// getRawTransaction gets a bitcoin transaction from testnet in raw / hex format.
async function getRawTransaction(txid) {
  const url = `${WHATSONCHAIN_API_TESTNET}/tx/${txid}/hex`

  const response = await axios({
    method: 'get',
    url
  })

  return response.data
}

// getFundsFromFaucet gets satoshis from the testnet faucet.
async function getFundsFromFaucet(address) {
  const url = `${WHATSONCHAIN_API_TESTNET}/faucet/send/${address}`

  const response = await axios.get(url)

  const txid = response.data

  // Check this is a valid hex string
  if (!txid.match(/^[0-9a-fA-F]{64}$/)) {
    throw new Error(`Failed to get funds: ${txid}`)
  }

  const faucetTx = await getTransaction(txid)

  let vout = 0
  if (faucetTx.vout[0].value !== 0.01) {
    vout = 1
  }
  return [{
    txid,
    vout,
    scriptPubKey: faucetTx.vout[vout].scriptPubKey.hex,
    satoshis: bitcoinToSatoshis(faucetTx.vout[vout].value)
  }]
}

function bitcoinToSatoshis(amount) {
  return Math.round(amount * SATS_PER_BITCOIN)
}

function PrivateKey(){
  return bsv.PrivateKey();
}

function Transaction(txObj){
  return new bsv.Transaction(txObj);
}


module.exports = {
  getTransaction,
  getRawTransaction,
  getFundsFromFaucet,
  getNextUTXO,
  bitcoinToSatoshis,
  PrivateKey,
  Transaction,
  createOutputBody,
  updateOutputBody,
  createProjectBody,
  createTransactionBody,
  submitTransactionBody,
  REST_options,
  REST_request,
  imageInscription,
  htmlInscription,
  textInscription,
};


