var BondToken = artifacts.require("./BondToken.sol");

module.exports = function(deployer) {
      deployer.deploy(BondToken);
}