#!/usr/bin/env node

const StellarSdk = require('stellar-sdk');
const axios = require('axios');

const issuerKeyPair = StellarSdk.Keypair.fromSecret(
  'SD2HUYFZPFIFJFLTWOK6JADUKAXVPGQKB7I3CVLK7ERTBYEMYLWD6OHE'
);
const distributorKeyPair = StellarSdk.Keypair.fromSecret(
  'SBAP2C3S3QQA3LQDNIXJQD44GBQLTQ7BO5GUX2FKYXNKBWFBYVAUNJO3'
);

(async function createIssuerAccount() {
  try {
    const response = await axios.get(
      `https://friendbot.stellar.org?addr=${encodeURIComponent(
        issuerKeyPair.publicKey()
      )}`
    );
    const responseJSON = await response.json();
    console.log('SUCCESS! You have a new account :)\n', responseJSON);
  } catch (e) {
    console.error('ERROR!', e);
  }
  // After you've got your test lumens from friendbot, we can also use that account to create a new account on the ledger.
  try {
    const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');
    let parentAccount = await server.loadAccount(issuerKeyPair.publicKey()); //make sure the parent account exists on ledger
    console.log('parentAccount', parentAccount);
    //create a transacion object.
    var createAccountTx = new StellarSdk.TransactionBuilder(parentAccount, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: StellarSdk.Networks.TESTNET,
    });
    //add the create account operation to the createAccountTx transaction.
    createAccountTx = await createAccountTx
      .addOperation(
        StellarSdk.Operation.createAccount({
          destination: issuerKeyPair.publicKey(),
          startingBalance: '5000',
        })
      )
      .setTimeout(100)
      .build();
    //sign the transaction with the account that was created from friendbot.
    await createAccountTx.sign(issuerKeyPair);
    //submit the transaction
    let txResponse = await server
      .submitTransaction(createAccountTx)
      // some simple error handling
      .catch(function (error) {
        console.log('there was an error');
        console.log(error.response);
        return error;
      });
    console.log('Created the new account', issuerKeyPair.publicKey());
  } catch (e) {
    console.error('ERROR!', e);
  }
})();

// module.exports = createIssuerAccount;
