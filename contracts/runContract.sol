pragma solidity ^0.5.16;

contract RunContract {

    // address payable ownerAddress;
    // uint basePrice;
    mapping (string => address payable) private dev-fun;
    mapping (string => uint) private fun-prices;

    event runRequest(address payable fUser, string fName, string fParameters, address payable fDeveloper);
    //Se teniamo la funzione di somma, usiamo uint per mettergli i risultati
    event runResult(address payable rReceiver, string fResult); //, uint remainingEthers);

    // constructor () public{
    //     ownerAddress = msg.sender;
    //     //equivale a 0.05 ether
    //     basePrice = 50000000000000000 wei;
    // }
    function getString() public pure returns(string memory) {
        return "Hello";
    }

    function sendRunEvent(string memory fName, string memory fParameters, ) public{ 
        //Richiesta minima di basePrice sul wallet per eseguire l'operazione
        // require(ownerAddress.balance >= basePrice);
        //Trasferisce al contratto gli eth di basePrice dal wallet
        // ownerAddress.transfer(basePrice);
        //A questo punto si può procedere con la richiesta del run
        dev-fun[fName].transfer(fun-prices[fName]);
        emit runRequest(msg.sender, fName, fParameters, dev-fun[fName]);
    }

    function sendRunResult(address payable rReceiver, string fResult, uint moneyLeft) //, uint runCost) payable 
    public{
        //Calcola il resto
        // uint remainingEthers = basePrice - runCost;
        //Riassegna il resto al wallet che ha inviato la richiesta

        //TO DO
        //Pezzo mancante...restituire i soldi da contract a wallet (dovrebbe essere una riga)
        

        //Manda l'evento alla cli con risultato e resto di cui fare il console log
        rReceiver.transfer(moneyLeft);
        emit runResult(rReceiver, fResult); //, remainingEthers);
    }
}