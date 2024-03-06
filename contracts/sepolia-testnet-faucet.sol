// SPDX-License-Identifier: MIT
pragma solidity >=0.6.12 <0.9.0;

contract Faucet {
  // Accept any incomeing ammount
  receive() external payable {}

  // Give out ether to anyone who asks
  function withdraw(uint ammount) public {
    // Limit withdraw ammount => 10^17 = 0.1 ether
    require(ammount <= 100000000000000000);

    // Send the ammount to the address that requested it
    msg.sender.transfer(ammount);
  }
}