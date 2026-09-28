const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  
  // REPLACE WITH YOUR METAMASK ACCOUNT 1 ADDRESS BELOW
  const myMetaMaskAddress = "0xe635Ec60635C7edC1c2Eaa10D70577C1A2E506AF";

  console.log("Sending 100 ETH from Hardhat to:", myMetaMaskAddress);

  const tx = await deployer.sendTransaction({
    to: myMetaMaskAddress,
    value: ethers.parseEther("100.0"),
  });

  await tx.wait();
  console.log("SUCCESS! 100 ETH sent successfully!");
}

main().catch(console.error);
