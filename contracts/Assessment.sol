// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract Assessment {
    address payable public owner;
    mapping(address => uint256) private balances;
    mapping(address => string) public messages;
    mapping(address => string[]) private transactionHistory;

    event Deposit(address indexed account, uint256 amount);
    event Withdraw(address indexed account, uint256 amount);
    event MessageUpdated(address indexed account, string newMessage);
    event OddOrEvenChecked(address indexed account, string result);

    constructor() {
        owner = payable(msg.sender);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "You are not the owner");
        _;
    }

    function getBalance(address _account) public view returns (uint256) {
        return balances[_account];
    }

    function deposit() public payable {
        require(msg.value > 0, "Deposit amount must be greater than zero");
        balances[msg.sender] += msg.value;
        transactionHistory[msg.sender].push(string(abi.encodePacked("Deposited: ", uint2str(msg.value))));
        emit Deposit(msg.sender, msg.value);
    }

    function withdraw(uint256 _amount) public {
        require(balances[msg.sender] >= _amount, "Insufficient balance");
        balances[msg.sender] -= _amount;
        payable(msg.sender).transfer(_amount);
        transactionHistory[msg.sender].push(string(abi.encodePacked("Withdrew: ", uint2str(_amount))));
        emit Withdraw(msg.sender, _amount);
    }

    function setMessage(string memory _message) public {
        require(balances[msg.sender] >= 1, "Insufficient balance to send message");
        balances[msg.sender] -= 1;
        messages[msg.sender] = _message;
        transactionHistory[msg.sender].push("Set a new message");
        emit MessageUpdated(msg.sender, _message);
    }

    function getMessage(address _account) public view returns (string memory) {
        return messages[_account];
    }

    function checkOddOrEven(uint256 num1, uint256 num2) public {
        require(balances[msg.sender] >= 1, "Insufficient balance to perform check");
        uint256 sum = num1 + num2;
        string memory result = (sum % 2 == 0) ? "Even" : "Odd";
        balances[msg.sender] -= 1; // Deduct 1 unit from the balance
        transactionHistory[msg.sender].push(string(abi.encodePacked("Checked odd or even: ", result)));
        emit OddOrEvenChecked(msg.sender, result);
    }

    function getTransactionHistory(address _account) public view returns (string[] memory) {
        return transactionHistory[_account];
    }

    function uint2str(uint256 _i) internal pure returns (string memory _uintAsString) {
        if (_i == 0) {
            return "0";
        }
        uint256 j = _i;
        uint256 len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint256 k = len;
        while (_i != 0) {
            k = k - 1;
            uint8 temp = (48 + uint8(_i - _i / 10 * 10));
            bytes1 b1 = bytes1(temp);
            bstr[k] = b1;
            _i /= 10;
        }
        return string(bstr);
    }
}
