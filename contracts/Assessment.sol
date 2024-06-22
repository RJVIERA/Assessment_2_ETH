// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

//import "hardhat/console.sol";

contract Assessment {
    address payable public owner;
    uint256 public balance;

    event Deposit(uint256 amount);
    event Withdraw(uint256 amount);

    constructor(uint initBalance) payable {
        owner = payable(msg.sender);
        balance = initBalance;
    }

    function getBalance() public view returns(uint256){
        return balance;
    }

    function deposit(uint256 _amount) public payable {
        uint _previousBalance = balance;

        // make sure this is the owner
        require(msg.sender == owner, "You are not the owner of this account");

        // perform transaction
        balance += _amount;

        // assert transaction completed successfully
        assert(balance == _previousBalance + _amount);

        // emit the event
        emit Deposit(_amount);
    }

    // custom error
    error InsufficientBalance(uint256 balance, uint256 withdrawAmount);

    function withdraw(uint256 _withdrawAmount) public {
        require(msg.sender == owner, "You are not the owner of this account");
        uint _previousBalance = balance;
        if (balance < _withdrawAmount) {
            revert InsufficientBalance({
                balance: balance,
                withdrawAmount: _withdrawAmount
            });
        }

        // withdraw the given amount
        balance -= _withdrawAmount;

        // assert the balance is correct
        assert(balance == (_previousBalance - _withdrawAmount));

        // emit the event
        emit Withdraw(_withdrawAmount);
    }

    // Function to deposit a custom amount of ETH with a personal message
    function customDeposit(uint256 _amount) public payable {
        // Check if the deposit amount is more than 5 ETH
        require(_amount > 5 ether, "Deposit amount must be more than 5 ETH");
        
        // perform transaction
        balance += _amount;

        // emit the deposit event
        emit Deposit(_amount);
    }


    function customWithdraw(uint256 _withdrawAmount) public {
        // Ensure only the owner can withdraw
        require(msg.sender == owner, "You are not the owner of this account");

        // Custom condition: Withdraw amount must be less than 2 ETH
        require(_withdrawAmount < 2 ether, "Withdraw amount must be less than 2 ETH");

        uint _previousBalance = balance;

        // Check for sufficient balance
        if (balance < _withdrawAmount) {
            revert InsufficientBalance({
                balance: balance,
                withdrawAmount: _withdrawAmount
            });
        }

        // Withdraw the specified amount
        balance -= _withdrawAmount;

        // Assert the balance is correct
        assert(balance == (_previousBalance - _withdrawAmount));

        // Emit the withdraw event
        emit Withdraw(_withdrawAmount);
    }

}
