pragma solidity ^0.5.16;

contract RunContract {

    // address payable ownerAddress;
    // uint basePrice;

    event runRequest(string fCode, string fParameters);
    //Se teniamo la funzione di somma, usiamo uint per mettergli i risultati
    event runResult(uint fResult); //, uint remainingEthers);

    // constructor () public{
    //     ownerAddress = msg.sender;
    //     //equivale a 0.05 ether
    //     basePrice = 50000000000000000 wei;
    // }
    function getString() public view returns(string memory) {
        return "Hello";
    }

    function sendRunEvent(string memory fCode, string memory fParameters) public{ 
        //Richiesta minima di basePrice sul wallet per eseguire l'operazione
        // require(ownerAddress.balance >= basePrice);
        //Trasferisce al contratto gli eth di basePrice dal wallet
        // ownerAddress.transfer(basePrice);
        //A questo punto si può procedere con la richiesta del run
        emit runRequest(fCode, fParameters);
    }

    function sendRunResult(uint fResult) //, uint runCost) payable 
    public{
        //Calcola il resto
        // uint remainingEthers = basePrice - runCost;
        //Riassegna il resto al wallet che ha inviato la richiesta

        //TO DO
        //Pezzo mancante...restituire i soldi da contract a wallet (dovrebbe essere una riga)
        

        //Manda l'evento alla cli con risultato e resto di cui fare il console log
        emit runResult(fResult); //, remainingEthers);
    }
} 
