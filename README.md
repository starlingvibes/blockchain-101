# blockchain-101

## What is a blockchain?

A blockchain is a distributed database that maintains a continuously-growing list of ordered records called blocks. Each block contains a timestamp and a link to a previous block. By design, blockchains are inherently resistant to modification of the data. Once recorded, the data in any given block cannot be altered retroactively without the alteration of all subsequent blocks, which requires consensus of the network majority.

## To start the blockchain

1. Run the following command in the root directory of the project, to install dependencies:

```
$ npm install
```

2. Start the blockchain class:

```
$ node blockchainClass.js
```

To create accounts, fund them and issue "StarlingVibe" token on the Stellar Testnet in isolation, run:

```
$ bash main.sh
```

## PoC

Token Issuance
<br>
![Token issuance](./assets/token-issuer.png 'Token Issuer')

Token Distribution
<br>
![Token Distribution](./assets/token-distributor.png 'Token Distributor')
