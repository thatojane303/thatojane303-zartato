it("should allow only owner to call mint (reverted)", async function () {
  const amount = ethers.parseUnits("1", 18);
  await expect(token.connect(addr1).mint(addr1.address, amount))
    .to.be.revertedWithCustomError(token, "OwnableUnauthorizedAccount");
});