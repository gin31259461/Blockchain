// SPDX-License-Identifier: MIT
pragma solidity >=0.6.12 <0.9.0;

contract HelloWorld {
  function getMessage() public pure returns (string memory) {
    return "Contract testing";
  }
}

contract Test {}