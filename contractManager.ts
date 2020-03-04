import * as fs from 'fs';
import * as path from 'path';
import * as solc from 'solc';
import fetch from 'node-fetch';

export interface CompiledContract {
    interface: string;
    bytecode: string;
}

export function compileContract(contractPath: string): CompiledContract {

    const contractSource: string = fs.readFileSync(contractPath, 'utf-8');
    const contractName: string = path.basename(contractPath, '.sol');
    const contractFileName: string = path.basename(contractPath);
    const contractId = contractName.charAt(0).toUpperCase() + contractName.substring(1);

    const params = {
        language: "Solidity",
        sources: {
          [contractFileName]: {
            content: contractSource
          }
        },
        settings: {
          outputSelection: {
            "*": {
              "*": [ "abi", "evm.bytecode.object" ]
            }
          }
        }
    };

    const compiledContract = JSON.parse(solc.compileStandardWrapper(JSON.stringify(params))).contracts[contractFileName][contractId];
    return { interface: compiledContract.abi, bytecode: compiledContract.evm.bytecode.object };
}

export async function getContractInterfaceByAddress(contractAddress: string): Promise<string> {
  try {
    const etherescan_url = `https://api-ropsten.etherscan.io/api?module=contract&action=getabi&address=${contractAddress}&apikey=${process.env.ETHERSCAN_API_KEY}`;
    const response = await fetch(etherescan_url);
    const respJSON = await response.json();
    return respJSON.result;
  }
  catch (e) {
    console.log(e);
  }
}
