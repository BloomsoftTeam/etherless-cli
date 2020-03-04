import * as path from 'path';
import * as fs from 'fs';
import { ethers } from 'ethers';
import { Contract } from 'ethers/contract';
import { Wallet } from 'ethers/wallet';
import { InfuraProvider } from 'ethers/providers';
import dotenv = require('dotenv');

import * as contractManager from "./contractManager";
import { KeyManager } from "./keyManager";

dotenv.config();

export class EthersManager {
    readonly provider: InfuraProvider;
    readonly keyManager: KeyManager;
    userWallet: Wallet;

    constructor(keyManager: KeyManager) {
        this.provider = new ethers.providers.InfuraProvider('ropsten', process.env.INFURA_PROJECT_ID);
        this.keyManager = keyManager;
    }

    newWallet(): Wallet {
        const bytes = ethers.utils.randomBytes(16);
        const randomMnemonic = ethers.utils.HDNode.entropyToMnemonic(bytes, ethers.wordlists.en);
        const myWallet = ethers.Wallet.fromMnemonic(randomMnemonic);
        return myWallet;
    }

    getWalletFromPrivate(privateKey: string): Wallet | null {
        try {
            const myWallet = new ethers.Wallet(privateKey, this.provider);
            return myWallet;
        }
        catch (e) {
            console.error(e);
            return null;      
        }
    }

    // Quando chiamate, questo metodo ritornerà una promise e dovete aggiungere per forza un catch block
    async loadSmartContract(contractAddress: string): Promise<Contract> {
        const contractInterface = await contractManager.getContractInterfaceByAddress(contractAddress);
        const contract = new ethers.Contract(contractAddress, contractInterface, this.provider);
        return contract;
    }

    saveEthWalletCredentials(wallet: Wallet) {
        this.keyManager.saveCredentials(wallet.privateKey);
        let credentialsPath = path.resolve(__dirname, '.credentials');
        let walletPath = path.resolve(credentialsPath , 'wallet.txt');
        fs.writeFileSync(walletPath, "Wallet address: " + wallet.address + "\nPrivate Key: " + wallet.privateKey);
    }

    /* ------------------------------------------------------------------------------------------------------------- */

    checkEthWalletExistance() {
        return fs.existsSync(this.keyManager.privatePath)
    }

    createNewEthWallet(): Wallet {
        const myNewWallet = this.newWallet();
        this.userWallet = myNewWallet;
        this.saveEthWalletCredentials(myNewWallet);
        return myNewWallet;
    }

    linkEthWallet(privateKey: string): boolean {
        let walletFromPrivate = this.getWalletFromPrivate(privateKey);
        this.saveEthWalletCredentials(walletFromPrivate);
        if (walletFromPrivate == null) {
            return false
        } 
        else {
            this.userWallet = walletFromPrivate;
            return true;
        }
    }

    loadWalletFromFS() {
        return new Promise((resolve, reject) => {
            try {
                if (fs.existsSync(this.keyManager.privatePath)) {
                    this.keyManager.decryptKey().then((privateKey: string) => {
                        try {
                            this.linkEthWallet(privateKey) ? resolve(true) : reject(false);
                        }
                        catch(e) {
                            console.error(e);
                            reject(false);        
                        }
                    });
                } 
                else {
                    reject(false);
                }
            }
            catch(err) {
                console.error(err);
                reject(false);
            }
        })
    }

    removeWalletFromFS(): boolean {
        let removeKey = this.keyManager.removeCredentials();
        let credentialsPath = path.resolve(__dirname, '.credentials');
        let walletPath = path.resolve(credentialsPath , 'wallet.txt');
        try {
            fs.unlinkSync(walletPath);
            return true && removeKey;
        } catch(err) {
            return false;
        }
    }

    async deploySmartContract(contractPath: string) {
        const deployContract = async () => {
            const alfredCompiled = contractManager.compileContract(contractPath);
            let factory = new ethers.ContractFactory(alfredCompiled.interface, alfredCompiled.bytecode).connect(this.userWallet);
            const myContract = await factory.deploy();
            console.log('contract address being deployed: ' + myContract.address);
            await myContract.deployed().then((contract) => { console.log('contract UPLOADED: ' + contract.address); });
        }

        await deployContract()
        .catch(e => { console.log(e); });
    }

    showPrivateKey() {
        this.keyManager.decryptKey().then(console.log).catch(console.log);
    }


    createContract(contractAddress): Contract{
        let abiContratto = "[{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"string\",\"name\":\"fCode\",\"type\":\"string\"},{\"indexed\":false,\"internalType\":\"string\",\"name\":\"fParameters\",\"type\":\"string\"}],\"name\":\"runRequest\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"fResult\",\"type\":\"uint256\"}],\"name\":\"runResult\",\"type\":\"event\"},{\"constant\":true,\"inputs\":[],\"name\":\"getString\",\"outputs\":[{\"internalType\":\"string\",\"name\":\"\",\"type\":\"string\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"internalType\":\"string\",\"name\":\"fCode\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"fParameters\",\"type\":\"string\"}],\"name\":\"sendRunEvent\",\"outputs\":[],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"fResult\",\"type\":\"uint256\"}],\"name\":\"sendRunResult\",\"outputs\":[],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"}]" ;
        return new ethers.Contract(contractAddress, abiContratto, this.provider);
    }
};
