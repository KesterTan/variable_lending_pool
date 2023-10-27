// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract LendingPool {
    address public owner;
    uint256 public interestRate; // Annual interest rate in percentage (e.g., 5%)
    uint256 public totalDeposits;

    struct Borrower {
        uint256 borrowedAmount;
        uint256 repaymentAmount;
        uint256 monthlyRepayment;
    }

    mapping(address => uint256) public deposits;
    mapping(address => Borrower) public borrowers;

    constructor(uint256 _interestRate) {
        owner = msg.sender;
        interestRate = _interestRate;
    }

    function deposit() public payable {
        deposits[msg.sender] += msg.value;
        totalDeposits += msg.value;
    }

    function borrow(uint256 amount) public {
        require(deposits[msg.sender] >= amount, "Insufficient balance");
        require(borrowers[msg.sender].borrowedAmount == 0, "Already a borrower");
        
        uint256 annualInterest = (amount * interestRate) / 100;
        uint256 monthlyInterest = annualInterest / 12;
        uint256 monthlyRepayment = (amount + monthlyInterest) / 12;

        borrowers[msg.sender] = Borrower({
            borrowedAmount: amount,
            repaymentAmount: amount + annualInterest,
            monthlyRepayment: monthlyRepayment
        });

        deposits[msg.sender] -= amount;
    }

    function canMakePayment() public view returns (bool) {
        Borrower storage borrower = borrowers[msg.sender];
        return borrower.repaymentAmount > 0 && deposits[msg.sender] >= borrower.monthlyRepayment;
    }
}
