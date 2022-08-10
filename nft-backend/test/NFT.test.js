const { expect } = require("chai");
const { ethers } = require("hardhat");
const { getAccount } = require("../scripts/helpers");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("Token contract", function () {
  beforeEach(async function () {
    const [owner] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("NFT", getAccount());

    const hardhatToken = await Token.deploy();

    ownerBalance = await hardhatToken.balanceOf(owner.address);
  });

  it("should have 0 token", async () => {
    const [owner, addr1, addr2] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("NFT", getAccount());

    const hardhatToken = await Token.deploy();

    const ownerBalance = await hardhatToken.balanceOf(owner.address);
    expect(ownerBalance.toString()).to.equal("0");

    await hardhatToken.mintTo(owner.address, {
      value: ethers.utils.parseEther("0.001"),
    });

    const afterOwnerBalance = await hardhatToken.balanceOf(owner.address);
    expect(afterOwnerBalance.toString()).to.equal("1");
  });
});
