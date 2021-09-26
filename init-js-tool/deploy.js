require('dotenv').config();
const { makeContractDeploy, broadcastTransaction, AnchorMode } = require('@stacks/transactions');
const fs = require('fs')
const {
    getPK, network
  } = require('./wallet');
const readline = require('readline-promise').default;
const { exit } = require('process');


let contract_records = {"Contracts":[]}
let VERSION;
let contract_paths = [
    "lib/math-log-exp.clar",
    "lib/math-fixed-point.clar",
    "traits/trait-flash-loan-user.clar",
    "traits/trait-oracle.clar",
    "traits/trait-pool-token.clar",
    "traits/trait-sip-010.clar",
    "traits/trait-yield-token.clar",
    "traits/trait-ownable.clar",
    "traits/trait-vault.clar",
    "traits/trait-multisig-vote.clar",
    "equations/weighted-equation.clar",
    "equations/yield-token-equation.clar",    
    "token/token-alex.clar",
    "token/token-usda.clar",
    "token/token-wbtc.clar",
    "alex-vault.clar",    
    "open-oracle.clar",    
    "pool/alex-reserve-pool.clar",
    "pool/fixed-weight-pool.clar",
    "pool/liquidity-bootstrapping-pool.clar",
    "pool/yield-token-pool.clar",
    "pool/collateral-rebalancing-pool.clar",
    "yield-token/yield-wbtc-59760.clar",
    "yield-token/yield-wbtc-79760.clar",    
    "key-token/key-wbtc-59760-usda.clar",
    "key-token/key-wbtc-79760-usda.clar",
    "pool-token/fwp-wbtc-usda-50-50.clar",    
    "pool-token/ytp-yield-wbtc-59760-wbtc.clar",
    "pool-token/ytp-yield-wbtc-79760-wbtc.clar",
    "multisig/multisig-crp-wbtc-59760-usda.clar",
    "multisig/multisig-crp-wbtc-79760-usda.clar",
    "multisig/multisig-fwp-wbtc-usda-50-50.clar",
    "multisig/multisig-ytp-yield-wbtc-59760-wbtc.clar",
    "multisig/multisig-ytp-yield-wbtc-79760-wbtc.clar",
    "flash-loan-user-margin-usda-wbtc-59760.clar",    
    "key-token/key-wbtc-59760-wbtc.clar",
    "multisig/multisig-crp-wbtc-59760-wbtc.clar",      
    "pool-token/ytp-yield-wbtc-23670-wbtc.clar",    
    "yield-token/yield-wbtc-23670.clar",
    "key-token/key-wbtc-23670-usda.clar",    
    "multisig/multisig-crp-wbtc-23670-usda.clar",  
    "multisig/multisig-ytp-yield-wbtc-23670-wbtc.clar",  
    "flash-loan-user-margin-usda-wbtc-23670.clar",         
    "pool-token/ytp-yield-wbtc-23040-wbtc.clar",    
    "yield-token/yield-wbtc-23040.clar",
    "key-token/key-wbtc-23040-usda.clar",    
    "multisig/multisig-crp-wbtc-23040-usda.clar",  
    "multisig/multisig-ytp-yield-wbtc-23040-wbtc.clar",  
    "flash-loan-user-margin-usda-wbtc-23040.clar",    
    "pool-token/ytp-yield-wbtc-34560-wbtc.clar",    
    "yield-token/yield-wbtc-34560.clar",
    "key-token/key-wbtc-34560-usda.clar",    
    "multisig/multisig-crp-wbtc-34560-usda.clar",  
    "multisig/multisig-ytp-yield-wbtc-34560-wbtc.clar",  
    "flash-loan-user-margin-usda-wbtc-34560.clar",   
    "pool-token/ytp-yield-wbtc-74880-wbtc.clar",    
    "yield-token/yield-wbtc-74880.clar",
    "key-token/key-wbtc-74880-usda.clar",    
    "multisig/multisig-crp-wbtc-74880-usda.clar",  
    "multisig/multisig-ytp-yield-wbtc-74880-wbtc.clar",  
    "flash-loan-user-margin-usda-wbtc-74880.clar",     
    "pool-token/ytp-yield-usda-23040-usda.clar",    
    "yield-token/yield-usda-23040.clar",
    "key-token/key-usda-23040-wbtc.clar",    
    "multisig/multisig-crp-usda-23040-wbtc.clar",  
    "multisig/multisig-ytp-yield-usda-23040-usda.clar",  
    "pool-token/ytp-yield-usda-34560-usda.clar",    
    "yield-token/yield-usda-34560.clar",
    "key-token/key-usda-34560-wbtc.clar",    
    "multisig/multisig-crp-usda-34560-wbtc.clar",  
    "multisig/multisig-ytp-yield-usda-34560-usda.clar",  
    "pool-token/ytp-yield-usda-74880-usda.clar",
    "key-token/key-usda-74880-wbtc.clar",    
    "yield-token/yield-usda-74880.clar",    
    "multisig/multisig-crp-usda-74880-wbtc.clar",  
    "multisig/multisig-ytp-yield-usda-74880-usda.clar",  
    "flash-loan-user-margin-wbtc-usda-34560.clar",       
    "flash-loan-user-margin-wbtc-usda-23040.clar",        
    "flash-loan-user-margin-wbtc-usda-74880.clar",   
    "faucet.clar"      
]


async function get_version(){
    const rlp = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: true
      });
    let answer = await rlp.questionAsync('What is the version number? ')
    return answer
}

function sleep(ms) {
    return new Promise(
        resolve => setTimeout(resolve, ms)
    );
}
async function walkDir() {
    // console.log(paths)
    await contract_paths.reduce(async (memo, path) => {
        await memo
        let contract_file = path.split('/').at(-1)
        let contract_name = contract_file.split('.')[0]
        await deploy("../clarity/contracts/"+path, contract_name)
    }, undefined);
  };

async function deploy(filePath, contractName){
    console.log("Deploying:: ", contractName )
    let privatekey = await getPK();
    const txOptions = {
      contractName: contractName,
      codeBody: fs.readFileSync(filePath).toString(),
      senderKey: privatekey,
      network,
    };
    const transaction = await makeContractDeploy(txOptions);
    const broadcast_id = await broadcastTransaction(transaction, network);
    // console.log(broadcast_id)
    //console.log(`https://regtest-2.alexgo.io/extended/v1/tx/0x${broadcast_id.txid}`)
    while (true){
        let truth = await fetch(`https://regtest-2.alexgo.io/extended/v1/tx/0x${broadcast_id.txid}`)
        let res = await truth.json();
        console.log("Waiting...")
        if (res['tx_status'] === 'success'){
            break;
        }
        await sleep(3000)
    }
    console.log("Contract Deployed Successfully")
    let contract_record = {}
    contract_record['name'] = contractName
    contract_record['version'] = VERSION
    contract_record['deployer'] = process.env.ACCOUNT_ADDRESS
    contract_records['Contracts'].push(contract_record)
}

async function run(){
    VERSION = await get_version()
    //walk the batches directory and deploy
    await walkDir();
    //write to file
    console.log(contract_records)
    fs.writeFile('./contract-records.json', JSON.stringify(contract_records), 'utf8', function (err){
        if (err) throw err
        console.log("File created")
        exit()
    });

}
run()