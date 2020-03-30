import fetch from 'node-fetch';

import { ethers } from 'ethers';
import { Contract } from 'ethers/contract';
import { Wallet } from 'ethers/wallet';
import { InfuraProvider } from 'ethers/providers';

export class EthersManager {
  readonly provider: InfuraProvider;

  constructor(infuraProvider: InfuraProvider) {
    this.provider = infuraProvider;
  }

  static newWallet(): Wallet {
    const bytes = ethers.utils.randomBytes(16);
    const randomMnemonic = ethers.utils.HDNode.entropyToMnemonic(bytes, ethers.wordlists.en);
    const myWallet = ethers.Wallet.fromMnemonic(randomMnemonic);
    return myWallet;
  }

  getWalletFromPrivate(privateKey: string): Wallet | null {
    try {
      const myWallet = new ethers.Wallet(privateKey, this.provider);
      return myWallet;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  // Quando chiamate, questo metodo ritornerà una promise e dovete settare per forza un catch block
  async loadSmartContract(contractAddress: string): Promise<Contract> {
    const contractInterface = await this.getContractInterfaceByAddress(contractAddress);
    const contract = new ethers.Contract(contractAddress, contractInterface, this.provider);
    return contract;
  }

  async getContractInterfaceByAddress(contractAddress: string): Promise<string> {
    try {
      const etherscanUrl = 'https://api-ropsten.etherscan.io/api';
      const query = `?module=contract&action=getabi&address=${contractAddress}&apikey=${process.env.ETHERSCAN_API_KEY}`;
      const response = await fetch(etherscanUrl + query);
      const respJSON = await response.json();
      return respJSON.result;
    } catch (e) {
      console.log(e);
      return e;
    }
  }
  
}
