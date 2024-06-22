# Ethereum ATM Contract

This Ethereum ATM contract facilitates deposit and withdrawal operations on the Ethereum blockchain. Users can deposit and withdraw Ether (ETH) through this contract, with customizable deposit and withdrawal amounts. Additionally, the contract imposes certain conditions on deposit and withdrawal transactions to ensure security and compliance.

## Description

This smart contract consists of two main functions: `customDeposit` and `customWithdraw`. The `customDeposit` function allows users to deposit an amount greater than 5 ETH into the contract, while the `customWithdraw` function permits the contract owner to withdraw funds, provided the withdrawal amount is less than 2 ETH. Both functions emit events upon successful deposit or withdrawal transactions.

## Usage

### Prerequisites

- Ensure you have an Ethereum wallet compatible with the Ethereum ecosystem, such as MetaMask.

### Deployment

1. Deploy the contract to the Ethereum blockchain using a suitable Ethereum development environment like Remix or Truffle.
2. Once deployed, users can interact with the contract by sending transactions to deposit or withdraw ETH.

## Functions

### customDeposit

- **Description**: Allows users to deposit an amount greater than 5 ETH into the contract.
- **Parameters**:
  - `_amount`: The amount of ETH to deposit (in Wei).
- **Conditions**:
  - The deposit amount must be more than 5 ETH.
- **Events**:
  - `Deposit`: Emits an event upon successful deposit.

### customWithdraw

- **Description**: Permits the contract owner to withdraw funds, provided the withdrawal amount is less than 2 ETH.
- **Parameters**:
  - `_withdrawAmount`: The amount of ETH to withdraw (in Wei).
- **Conditions**:
  - Only the owner of the contract can initiate a withdrawal.
  - The withdrawal amount must be less than 2 ETH.
- **Events**:
  - `Withdraw`: Emits an event upon successful withdrawal.

## Authors

RJ VIERA

