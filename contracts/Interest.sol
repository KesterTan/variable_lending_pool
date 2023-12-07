// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

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

contract LoanInterestCalculator {
    uint256 public riskPremium = 110; // Represents a 10% premium (will get divided by 100 later)

    function calculateInterest(
        uint256 amount,
        uint256 exchangeRate,
        uint256 creditScore
    ) public view returns (uint256) {
        // Calculate interest based on the risk premium and credit score
        uint256 baseInterest = (amount * riskPremium) / (100 * exchangeRate);
        uint256 creditScoreFactor;

        // Adjust the credit score factor based on credit score
        if (creditScore >= 800) {
            creditScoreFactor = 1; // Excellent credit
        } else if (creditScore >= 700) {
            creditScoreFactor = 2; // Good credit
        } else if (creditScore >= 600) {
            creditScoreFactor = 3; // Fair credit
        } else {
            creditScoreFactor = 4; // Poor credit
        }

        return baseInterest * creditScoreFactor;
    }

    function setRiskPremium(uint256 newRiskPremium) external {
        // Only the owner or an authorized party can set the risk premium
        // Add access control as needed
        riskPremium = newRiskPremium;
    }
}

contract BondedKT is ERC20Burnable, Ownable {
    constructor() ERC20("BondedKT", "BKT") {}
}

contract LendingPool is Ownable {
    BondedKT public bondedToken;
    Loan[] public loans;
    LoanInterestCalculator public interestCalculator;

    mapping(address => uint256) public usersCollateralDict;
    mapping(address => uint256) public usersBorrowedDict;
    event LoanCreated(address indexed borrower, uint indexed loanedAmount);

    constructor(address _interestCalculator) {
        bondedToken = new BondedKT();
        owner = msg.sender;
        interestCalculator = LoanInterestCalculator(_interestCalculator);
    }

    function createLoan(
        address _borrower,
        uint _loanedAmount,
        uint _creditScore
    ) external onlyOwner {
        // Calculate interest using the LoanInterestCalculator
        uint interest = interestCalculator.calculateInterest(
            _loanedAmount,
            1,
            _creditScore
        );

        // Create a new Loan instance
        Loan newLoan = new Loan(
            _borrower,
            _loanedAmount,
            interest,
            block.timestamp + 30 days // Loan duration of 30 days in this example
        );

        // Add the loan to the list of loans in the pool
        loans.push(newLoan);

        // Mint bonded tokens equivalent to the loan amount and transfer them to the lender
        bondedToken.mint(msg.sender, _loanedAmount);
    }

    function withdraw(uint256 amount) external {
                // Check that the lender has enough bonded tokens
        require(bondedToken.balanceOf(msg.sender) >= amount, "Not enough tokens");

        // Check that the contract has enough balance to cover the withdrawal
        require(address(this).balance >= amount, "Not enough funds in the pool");

        // Transfer the funds plus interest from the pool to the lender
        payable(msg.sender).transfer(amount + interest);
    }

    function getLoanCount() external view returns (uint) {
        return loans.length;
    }
}
