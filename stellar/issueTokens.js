#!/usr/bin/env node

const StellarSdk = require('stellar-sdk');

const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');

// Keys for accounts to issue and receive the new asset
const issuingKeys = StellarSdk.Keypair.fromSecret(
  'SD2HUYFZPFIFJFLTWOK6JADUKAXVPGQKB7I3CVLK7ERTBYEMYLWD6OHE'
);
const receivingKeys = StellarSdk.Keypair.fromSecret(
  'SBAP2C3S3QQA3LQDNIXJQD44GBQLTQ7BO5GUX2FKYXNKBWFBYVAUNJO3'
);

// Create an object to represent the new asset
const starlingVibes = new StellarSdk.Asset(
  'StarlingVibe', // asset code can only be a maximum of 12 characters
  issuingKeys.publicKey()
);

// First, the receiving account must trust the asset
server
  .loadAccount(receivingKeys.publicKey())
  .then(function (receiver) {
    const transaction = new StellarSdk.TransactionBuilder(receiver, {
      fee: 100,
      networkPassphrase: StellarSdk.Networks.TESTNET,
    })
      // The `changeTrust` operation creates (or alters) a trustline
      // The `limit` parameter below is optional
      .addOperation(
        StellarSdk.Operation.changeTrust({
          asset: starlingVibes,
          limit: '1000',
        })
      )
      // setTimeout is required for a transaction
      .setTimeout(100)
      .build();
    transaction.sign(receivingKeys);
    return server.submitTransaction(transaction);
  })
  .then(console.log)

  // Second, the issuing account actually sends a payment using the asset
  .then(function () {
    return server.loadAccount(issuingKeys.publicKey());
  })
  .then(function (issuer) {
    const transaction = new StellarSdk.TransactionBuilder(issuer, {
      fee: 100,
      networkPassphrase: StellarSdk.Networks.TESTNET,
    })
      .addOperation(
        StellarSdk.Operation.payment({
          destination: receivingKeys.publicKey(),
          asset: starlingVibes,
          amount: '10',
        })
      )
      // setTimeout is required for a transaction
      .setTimeout(100)
      .build();
    transaction.sign(issuingKeys);
    return server.submitTransaction(transaction);
  })
  .then(console.log)
  .catch(function (error) {
    console.error('Error!', error);
  });
