// SPDX-License-Identifier: MIT
pragma solidity >=0.6.12 <0.9.0;

contract BankContract {
  // variables
  struct ClientAccount {
    int clientId;
    address clientAddress;
    uint clientBlance;
  }

  ClientAccount[] clients;

  int clientCounter;

  address payable manager;

  mapping(address => uint) public interestDate;

  // constructor
  constructor() {
    clientCounter = 0;
  }

  // modifiers
  modifier onlyManager() {
    require(msg.sender == manager, 'Only manager can call!');
    _;
  }

  modifier onlyClients() {
    bool isClient = false;

    for (uint i = 0; i < clients.length; i++) {
      if (clients[i].clientAddress == msg.sender) {
        isClient = true;
        break;
      }
    }

    require(isClient, 'Only clients can call!');

    _;
  }

  // methods
  function setManager(address managerAddress) public returns (string memory) {
    manager = payable(managerAddress);

    return '';
  }

  function joinAsClient() public payable returns (string memory) {
    interestDate[msg.sender] = block.timestamp;
    clients.push(ClientAccount(clientCounter++, msg.sender, address(msg.sender).balance));

    return '';
  }

  function deposit() public payable onlyClients {
    payable(address(this)).transfer(msg.value);
  }

  function withdraw(uint amount) public payable onlyClients {
    // 0.1 ether
    require(amount <= 100000000000000000);

    payable(msg.sender).transfer(amount);
  }

  function sendInterest() public payable onlyManager {
    for (uint i = 0; i < clients.length; i++) {
      address initialAddress = clients[i].clientAddress;
      uint lastInterestDate = interestDate[initialAddress];
      if (block.timestamp < lastInterestDate + 10 seconds) {
        revert("It's just been less than 10 seconds!");
      }
      payable(initialAddress).transfer(1 ether);
      interestDate[initialAddress] = block.timestamp;
    }
  }

  function getContractBalance() public view returns (uint) {
    return address(this).balance;
  }

  // fallback
  receive() external payable {}
}
