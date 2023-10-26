// SPDX-License-Identifier: MIT
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
        balance = _loaned_amount;
    }
}