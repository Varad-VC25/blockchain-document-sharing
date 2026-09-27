const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DocumentRegistry Smart Contract", function () {
  let documentRegistry;
  let owner;
  let user1;
  let user2;

  const sampleCid = "bafybeifaugnkotastxc7so2cr4x3yxrmenujpo4vgg6rxle4jyzj7ikbee";
  const sampleHash = "a3f5c8d9e2b1f4a7c6d8e9f2a3b5c8d9e2b1f4a7c6d8e9f2a3b5c8d9e2b1f4a7";
  const fileName = "test_document.pdf";
  const mimeType = "application/pdf";
  const fileSize = 102450;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    const DocumentRegistry = await ethers.getContractFactory("DocumentRegistry");
    documentRegistry = await DocumentRegistry.deploy();
    await documentRegistry.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the correct contract owner", async function () {
      expect(await documentRegistry.contractOwner()).to.equal(owner.address);
    });

    it("Should start with zero registered documents", async function () {
      expect(await documentRegistry.totalDocumentsRegistered()).to.equal(0);
    });
  });

  describe("Document Registration", function () {
    it("Should allow a user to register a document", async function () {
      await expect(
        documentRegistry
          .connect(user1)
          .registerDocument(sampleCid, sampleHash, fileName, mimeType, fileSize)
      )
        .to.emit(documentRegistry, "DocumentRegistered")
        .withArgs(sampleCid, user1.address, sampleHash, fileName, (val) => val > 0n);

      expect(await documentRegistry.totalDocumentsRegistered()).to.equal(1);

      const doc = await documentRegistry.getDocument(sampleCid);
      expect(doc.ipfsCid).to.equal(sampleCid);
      expect(doc.fileHash).to.equal(sampleHash);
      expect(doc.owner).to.equal(user1.address);
      expect(doc.fileName).to.equal(fileName);
      expect(doc.exists).to.be.true;
    });

    it("Should prevent duplicate CID registrations", async function () {
      await documentRegistry
        .connect(user1)
        .registerDocument(sampleCid, sampleHash, fileName, mimeType, fileSize);

      await expect(
        documentRegistry
          .connect(user2)
          .registerDocument(sampleCid, sampleHash, fileName, mimeType, fileSize)
      ).to.be.revertedWith("Document with this CID already registered");
    });
  });

  describe("Access Control & Permissions", function () {
    beforeEach(async function () {
      await documentRegistry
        .connect(user1)
        .registerDocument(sampleCid, sampleHash, fileName, mimeType, fileSize);
    });

    it("Should grant owner access automatically", async function () {
      expect(await documentRegistry.checkAccess(sampleCid, user1.address)).to.be.true;
      expect(await documentRegistry.isOwner(sampleCid, user1.address)).to.be.true;
    });

    it("Should deny access to unauthorized users", async function () {
      expect(await documentRegistry.checkAccess(sampleCid, user2.address)).to.be.false;
      expect(await documentRegistry.isOwner(sampleCid, user2.address)).to.be.false;
    });

    it("Should allow owner to grant access to another address", async function () {
      await expect(documentRegistry.connect(user1).grantAccess(sampleCid, user2.address))
        .to.emit(documentRegistry, "AccessGranted")
        .withArgs(sampleCid, user1.address, user2.address, (val) => val > 0n);

      expect(await documentRegistry.checkAccess(sampleCid, user2.address)).to.be.true;
    });

    it("Should allow owner to revoke access", async function () {
      await documentRegistry.connect(user1).grantAccess(sampleCid, user2.address);
      expect(await documentRegistry.checkAccess(sampleCid, user2.address)).to.be.true;

      await expect(documentRegistry.connect(user1).revokeAccess(sampleCid, user2.address))
        .to.emit(documentRegistry, "AccessRevoked")
        .withArgs(sampleCid, user1.address, user2.address, (val) => val > 0n);

      expect(await documentRegistry.checkAccess(sampleCid, user2.address)).to.be.false;
    });

    it("Should prevent non-owners from granting or revoking access", async function () {
      await expect(
        documentRegistry.connect(user2).grantAccess(sampleCid, user2.address)
      ).to.be.revertedWith("Caller is not the owner of this document");
    });
  });

  describe("Cryptographic Integrity Verification", function () {
    beforeEach(async function () {
      await documentRegistry
        .connect(user1)
        .registerDocument(sampleCid, sampleHash, fileName, mimeType, fileSize);
    });

    it("Should return true for identical SHA-256 hash", async function () {
      expect(await documentRegistry.verifyIntegrity(sampleCid, sampleHash)).to.be.true;
    });

    it("Should return false for tampered/different hash", async function () {
      const tamperedHash = "b4e6d9c2a5f8b1e4d7c0a3f6b9c2e5d8a1f4b7c0e3d6a9c2f5b8e1d4a7c0f3b6";
      expect(await documentRegistry.verifyIntegrity(sampleCid, tamperedHash)).to.be.false;
    });
  });
});
