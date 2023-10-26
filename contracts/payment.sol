// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract LendingPlatform {
    address public owner;

    struct User {
        uint256 collateralAmount;
        uint256 borrowedAmount;
        uint256 creditScore;
        bool exists;
    }

    mapping(address => User) public users;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    function isBorrower(address userAddress) public view returns (bool) {
        return users[userAddress].exists;
    }

    function checkPaymentAbility(address borrowerAddress, uint256 interestRate) public view returns (bool, uint256) {
        User storage borrower = users[borrowerAddress];
        require(borrower.exists, "User does not exist");

        // Calculate the monthly payment based on the interest rate
        uint256 borrowedAmount = borrower.borrowedAmount;
        uint256 monthlyPayment = (borrowedAmount * interestRate) / 12; // Assuming annual interest rate

        // Check if the user has enough collateral to make monthly payments
        bool canAfford = borrower.collateralAmount >= monthlyPayment;

        return (canAfford, monthlyPayment);
    }
}