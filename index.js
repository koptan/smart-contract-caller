// Required imports
const { ApiPromise, WsProvider,Keyring } = require('@polkadot/api');

async function main () {
  var args = process.argv.slice(2);
    
  let url = args[0];
  let activity_id = args[1];


  // 0 -> success
  // 1 -> faild
  let result = args[2];

  let status = ''; 
        
  // Initialise the provider to connect to the local node
  const provider = new WsProvider(url);

  // Create the API and wait until ready
  const api = await ApiPromise.create({ provider });

  // Create a keyring instance
  const keyring = new Keyring({ type: 'sr25519' }); 

  // Retrieve the chain & node information information via rpc calls
  const [chain, nodeName, nodeVersion] = await Promise.all([
    api.rpc.system.chain(),
    api.rpc.system.name(),
    api.rpc.system.version()
  ]);

  console.log(`You are connected to chain ${chain} using ${nodeName} v${nodeVersion}`);

  if(result == "0"){
      status = "Passed";
  }else{
      status = "NotPassed";
  }

  // Create alice (carry-over from the keyring section)
  const alice = keyring.addFromUri('//Alice');

  await api.tx.templateModule.updateActivityStatus(activity_id,status)
   .signAndSend(alice,(result) => {
       console.log(`Current status is ${result.status}`);
       process.exit(0);
   });
}

main().catch(console.error)
