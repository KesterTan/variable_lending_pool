//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Loan {
    address public borrower;
    bool public paid;
    uint public loaned_amount;
    uint public balance;
    uint public interest_rate;
    uint public loan_duration;

    constructor(
        address _borrower,
        uint _loaned_amount,
        uint _interest_rate,
        uint _loan_duration
    ) {
        borrower = _borrower;
        loaned_amount = _loaned_amount;
        interest_rate = _interest_rate;
        loan_duration = _loan_duration;
        paid = false;
        balance = 0;
    }

    function verifyLoan() public view returns (bool) {
        uint256 applicantBalance = borrower.balance;
        return applicantBalance >= loaned_amount * (interest_rate ** loan_duration);
    }

    function initiateLoan() public payable {
        require(msg.sender == borrower, "Only the borrower can fund the loan");
        require(msg.value == loaned_amount, "Amount sent must be equal to the loaned amount");
        paid = true;
        balance = loaned_amount;
        // Mint bEth to borrower
    }
}