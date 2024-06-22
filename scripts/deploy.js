// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  const initBalance = 1;
  const Assessment = await hre.ethers.getContractFactory("Assessment");
  const assessment = await Assessment.deploy(initBalance);
  await assessment.deployed();

  console.log(`A contract with balance of ${initBalance} eth deployed to ${assessment.address}`);


  // Deposit more than 5 ETH with custom message
  const depositAmount = hre.ethers.utils.parseEther("6"); // 6 ETH
  const depositMessage = "Deposit for custom function test";
  await assessment.customDeposit(depositAmount);
  console.log("Deposit of", hre.ethers.utils.formatEther(depositAmount), "ETH with message:", depositMessage);
  

  const withdrawAmount = hre.ethers.utils.parseEther("1"); // 1 ETH
  await assessment.customWithdraw(withdrawAmount);
  console.log("Withdraw of", hre.ethers.utils.formatEther(withdrawAmount), "ETH");

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
