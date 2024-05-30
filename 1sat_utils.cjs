const axios = require('axios');
const bsv = require('bsv');

function create_output(projectUid) {
  const timestamp = new Date().getTime().toString();

  const create_output = {
    "projectUid": `${projectUid}`,
    "contentType": "image/png",
    "b64File": 'b64file',
    "metadata": {
        "name": `My single token ${timestamp}`,
        "subType": "anything",
        "subTypeData": "{\"description\": \"this is description\",  \"collectionId\": \"11752692a626b0728ef499242adfb71ddf830fae695499fa948117dbe5e4d648_0\"  }",
        "type": "ord",
        "description": "this is a collection description",
        "info": "anything",
        "eyes": "green"
    }
};
  return create_output;
}

function create_project() {
  const timestamp = new Date().getTime().toString()
  const create_project = {
    "name": `1satcol project ${timestamp}`,
    "isFungible": true,
    "type": "single",
    "tokenProtocol": "OneSatOrdinal"
};
  return create_project;
}


function create_transaction() {
  const create_transaction = {
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
return create_transaction;
}

function submit_transaction() {
  const submit_transaction = {
      "transactionUid": "{{transactionUid}}",
      "tx": "{{signedtx}}"
    }
    
return submit_transaction;
}


function REST_options(step, Apikey) {
  const options = {
    host: 'https://console.test.taal.com/token-studio/api/v1',
    path: '',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Apikey' : Apikey,
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
      //console.log(axiosRequest.data);
    }
    
    
    const response = await axios(axiosRequest);
    return response;
}

function imageInscription(){
  return ({"content-type" : "image/png", 
          "content" : "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"
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
  const url = `https://api.whatsonchain.com/v1/bsv/test/address/${address}/unconfirmed/unspent`

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
  const url = `https://api.whatsonchain.com/v1/bsv/test/tx/hash/${txid}`

  const response = await axios({
    method: 'get',
    url
  })

  return response.data
}

// getRawTransaction gets a bitcoin transaction from testnet in raw / hex format.
async function getRawTransaction(txid) {
  const url = `https://api.whatsonchain.com/v1/bsv/test/tx/${txid}/hex`

  const response = await axios({
    method: 'get',
    url
  })

  return response.data
}

// getFundsFromFaucet gets satoshis from the testnet faucet.
async function getFundsFromFaucet(address) {
  const url = `https://api.whatsonchain.com/v1/bsv/test/faucet/send/${address}`

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
  create_output,
  create_project,
  create_transaction,
  submit_transaction,
  REST_options,
  REST_request,
  imageInscription,
  htmlInscription,
  textInscription,
};


