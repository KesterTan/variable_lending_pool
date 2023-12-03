const hre = require("hardhat");

async function main() {
    // Deploy contract by using hre.ethers.deployContract
}

// Catch errors and exceptions
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});