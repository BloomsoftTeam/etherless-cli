pragma solidity 0.5.16;

contract ContractsInterface {

    mapping (string => address payable) public devFun;
    mapping (string => uint) public funPrices;

    function addDevFun(string memory fName, address payable fDeveloper) public {
        devFun[fName] = fDeveloper;
    }
    
    function addFunPrice(string memory fName, uint fPrice) public {
        funPrices[fName] = fPrice;
    }
}