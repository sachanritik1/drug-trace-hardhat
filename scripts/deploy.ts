import { ethers } from "hardhat";

async function main() {
  const supplychain = await ethers.deployContract("Supplychain");
  await supplychain.waitForDeployment();

  console.log(
    "Supplychain deployed to:",
    supplychain.getAddress(),
    "with the following account:",
    supplychain.owner
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
