const driver = require('bigchaindb-driver')
const API_PATH = 'http://localhost:9994/api/v1/'

const json = {"name": "this is name"}

postAsset(json)

async function postAsset (json) {

  const keyPair = new driver.Ed25519Keypair()

  // Construct a transaction payload
  const tx = driver.Transaction.makeCreateTransaction(
    json,

    // Metadata contains information about the transaction itself
    // (can be `null` if not needed)
    null,

    // A transaction needs an output
    [],
    keyPair.publicKey
  )

  // Sign the transaction with private keys
  const txSigned = driver.Transaction.signTransaction(tx, keyPair.privateKey)

  // Send the transaction off to BigchainDB
  const conn = new driver.Connection(API_PATH)

  // await sleep(1000)
  let retrievedTx = await conn.postTransactionAsync(txSigned)
  console.log('Transaction', retrievedTx.id, 'successfully posted.')
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
