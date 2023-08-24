#!/usr/bin/node

const SHA256 = require('crypto-js/sha256');
const { exec } = require('child_process');

/**
 * Represents a single block in the blockchain.
 */
class Block {
  constructor(index, timestamp, data, previousHash = '') {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }

  /**
   * Calculates the hash of the block.
   * @returns {string} The calculated hash.
   */
  calculateHash() {
    return SHA256(
      this.index +
        this.previousHash +
        this.timestamp +
        JSON.stringify(this.data)
    ).toString();
  }
}

/**
 * Represents a blockchain containing multiple blocks.
 */
class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 2;
  }

  /**
   * Creates the genesis block of the blockchain.
   * @returns {Block} The genesis block.
   */
  createGenesisBlock() {
    return new Block(0, new Date().toISOString(), 'Genesis Block', '0');
  }

  /**
   * Retrieves the latest block in the blockchain.
   * @returns {Block} The latest block.
   */
  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  /**
   * Displays information about all blocks in the blockchain.
   */
  getAllBlocks() {
    return this.chain;
  }

  /**
   * Mines a new block and adds it to the blockchain.
   * @param {Block} newBlock - The new block to be mined and added.
   */
  mineBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.index = this.chain.length;
    newBlock.timestamp = new Date().toISOString();

    while (
      newBlock.hash.substring(0, this.difficulty) !==
      Array(this.difficulty + 1).join('0')
    ) {
      newBlock.nonce++;
      newBlock.hash = newBlock.calculateHash();
    }

    this.chain.push(newBlock);
  }

  /**
   * Checks if a single block is valid.
   * @param {Block} newBlock - The block to be validated.
   * @param {Block} previousBlock - The previous block.
   * @returns {boolean} Whether the block is valid or not.
   */
  isBlockValid(newBlock, previousBlock) {
    if (newBlock.index !== previousBlock.index + 1) {
      return false;
    }

    if (newBlock.previousHash !== previousBlock.hash) {
      return false;
    }

    if (newBlock.hash !== newBlock.calculateHash()) {
      return false;
    }

    return true;
  }

  /**
   * Checks if the entire blockchain is valid.
   * @returns {boolean} Whether the blockchain is valid or not.
   */
  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (!this.isBlockValid(currentBlock, previousBlock)) {
        return false;
      }
    }
    return true;
  }

  async issueStarlingVibeAsset() {
    try {
      const scriptPath = './main.sh';
      const command = `bash ${scriptPath}`;

      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.log('Error:', error);
          return;
        }
        console.log('stdout:', stdout);
      });
    } catch (error) {
      console.log('Error:', error);
    }
  }
}

// TESTING THE BLOCKCHAIN CLASS
const myBlockchain = new Blockchain();
console.log('Issuing StarlingVibe asset...');
myBlockchain.issueStarlingVibeAsset();

console.log('Mining block 1...');
myBlockchain.mineBlock(new Block(1, null, { cost: 100 }));

console.log('Mining block 2...');
myBlockchain.mineBlock(new Block(2, null, { cost: 50 }));

// Fetch all blocks
console.log(myBlockchain.getAllBlocks());
