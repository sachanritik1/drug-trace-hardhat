const { network, ethers, deployments } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")
const { assert, expect } = require("chai")

!developmentChains.includes(network.name)
	? describe.skip
	: describe("Supplychain unit testing...", () => {
			let deployer,
				supplyChain,
				supplyChainContract,
				distributor,
				parmacy,
				pataint,
				manufacturer,
				notOwner
			beforeEach(async () => {
				const accounts = await ethers.getSigners()
				deployer = accounts[0]
				manufacturer = accounts[1]
				distributor = accounts[2]
				parmacy = accounts[3]
				pataint = accounts[4]
				notOwner = accounts[5]
				await deployments.fixture(["all"])
				supplyChainContract = await ethers.getContract("SupplyChain")
				supplyChain = supplyChainContract.connect(deployer)
			})

			describe("constructor", () => {
				it("should set the owner to the deployer", async () => {
					assert.equal(await supplyChain.owner(), deployer.address)
				})
			})

			describe("addManufacturer", () => {
				it("should add a manufacturer", async () => {
					await supplyChain.addManufacturer(manufacturer.address)
					assert.equal(
						await supplyChain.IsManufacturer(manufacturer.address),
						true
					)
				})
				it("should not add a manufacturer if not called by the owner", async () => {
					await expect(
						supplyChain.connect(notOwner).addManufacturer(distributor.address)
					).to.be.revertedWith("Only contract owner can perform this action")
				})
			})
			describe("addDistributor", () => {
				it("should add a Distributor", async () => {
					await supplyChain.addDistributor(distributor.address)
					assert.equal(
						await supplyChain.IsDistributor(distributor.address),
						true
					)
				})
				it("should not add a Distibutor if not called by the owner", async () => {
					await expect(
						supplyChain.connect(notOwner).addDistributor(distributor.address)
					).to.be.revertedWith("Only contract owner can perform this action")
				})
			})

			describe("addPharmacy", () => {
				it("should add a Pharmacy", async () => {
					await supplyChain.addPharmacy(parmacy.address)
					assert.equal(await supplyChain.IsPharmacy(parmacy.address), true)
				})
				it("should not add a Pharmacy if not called by the owner", async () => {
					await expect(
						supplyChain.connect(notOwner).addPharmacy(parmacy.address)
					).to.be.revertedWith("Only contract owner can perform this action")
				})
			})

			describe("addPatient", () => {
				it("should add a Patient", async () => {
					await supplyChain.addPatient(pataint.address)
					assert.equal(await supplyChain.IsPatient(pataint.address), true)
				})
				it("should not add a Patient if not called by the owner", async () => {
					await expect(
						supplyChain.connect(notOwner).addPatient(pataint.address)
					).to.be.revertedWith("Only contract owner can perform this action")
				})
			})

			describe("createDrug", () => {
				beforeEach(async () => {
					await supplyChain.addManufacturer(manufacturer.address)
				})
				it("should create a Drug", async () => {
					expect(
						await supplyChain.connect(manufacturer).createDrug("drug1", 100)
					).to.emit(supplyChain, "DrugCreated")
					assert.equal(await supplyChain.getDrugCount(), 1)
					assert.equal(await supplyChain.getDrugName(0), "drug1")
					assert.equal(await supplyChain.getDrugQuantity(0), 100)
					assert.equal(
						await supplyChain.getDrugManufacturer(0),
						manufacturer.address
					)
				})
				it("should not create a Drug if not called by a manufacturer", async () => {
					await expect(
						supplyChain.connect(notOwner).createDrug("drug2", 100)
					).to.be.revertedWith(
						"Only approved manufacturers can perform this action"
					)
				})
				it("should not create a Drug if quantity is less than 1", async () => {
					await expect(
						supplyChain.connect(manufacturer).createDrug("drug3", 0)
					).to.be.revertedWith("Quantity should be greater than zero")
				})
			})

			describe("shipDrug", () => {
				beforeEach(async () => {
					await supplyChain.addManufacturer(manufacturer.address)

					await supplyChain.addDistributor(distributor.address)
				})
				it("should ship a Drug", async () => {
					await supplyChain.connect(manufacturer).createDrug("drug1", 100)
					await supplyChain.connect(distributor).shipDrug(0)

					assert.equal(await supplyChain.getDrugState(0), 1)
					assert.equal(
						await supplyChain.getDrugDistributor(0),
						distributor.address
					)
				})
				it("should not ship a Drug if not called by a distributor", async () => {
					await supplyChain.connect(manufacturer).createDrug("drug1", 100)
					await expect(
						supplyChain.connect(notOwner).shipDrug(0)
					).to.be.revertedWith(
						"Only approved distributors can perform this action"
					)
				})
				it("should not ship a Drug if the drug is not in the created state", async () => {
					await supplyChain.connect(distributor).shipDrug(0)
					await expect(
						supplyChain.connect(distributor).shipDrug(0)
					).to.be.revertedWith(
						"Drug has not been created or already been shipped"
					)
				})
			})

			describe("receiveDrug", () => {
				beforeEach(async () => {
					await supplyChain.addManufacturer(manufacturer.address)
					await supplyChain.addDistributor(distributor.address)
					await supplyChain.addPharmacy(parmacy.address)
				})
				it("should receive a Drug", async () => {
					await supplyChain.connect(manufacturer).createDrug("drug1", 100)
					await supplyChain.connect(distributor).shipDrug(0)
					expect(await supplyChain.connect(parmacy).receiveDrug(0)).to.emit(
						supplyChain,
						"DrugReceived"
					)

					assert.equal(await supplyChain.getDrugState(0), 2)
					assert.equal(await supplyChain.getDrugPharmacy(0), parmacy.address)
				})
				it("should not receive a Drug if not called by a pharmacy", async () => {
					await supplyChain.connect(manufacturer).createDrug("drug1", 100)
					await supplyChain.connect(distributor).shipDrug(0)
					await expect(
						supplyChain.connect(notOwner).receiveDrug(0)
					).to.be.revertedWith(
						"Only approved pharmacies can perform this action"
					)
				})
				it("should not receive a Drug if the drug is not in the shipped state", async () => {
					await supplyChain.connect(manufacturer).createDrug("drug1", 100)
					await expect(
						supplyChain.connect(parmacy).receiveDrug(0)
					).to.be.revertedWith("Drug has not been shipped yet")
				})
			})

			describe("buyDrug", () => {
				beforeEach(async () => {
					await supplyChain.addManufacturer(manufacturer.address)
					await supplyChain.addDistributor(distributor.address)
					await supplyChain.addPharmacy(parmacy.address)
					await supplyChain.addPatient(pataint.address)
				})
				it("should buy a Drug", async () => {
					await supplyChain.connect(manufacturer).createDrug("drug1", 100)
					await supplyChain.connect(distributor).shipDrug(0)
					await supplyChain.connect(parmacy).receiveDrug(0)
					expect(await supplyChain.connect(pataint).buyDrug(0)).to.emit(
						supplyChain,
						"DrugBought"
					)

					assert.equal(await supplyChain.getDrugQuantity(0), 99)
					assert.equal(await supplyChain.getDrugPatient(0), pataint.address)
				})
				it("should not buy a Drug if not called by a patient", async () => {
					await supplyChain.connect(manufacturer).createDrug("drug1", 100)
					await supplyChain.connect(distributor).shipDrug(0)
					await supplyChain.connect(parmacy).receiveDrug(0)
					await expect(
						supplyChain.connect(notOwner).buyDrug(0)
					).to.be.revertedWith("Only approved patients can perform this action")
				})
				it("should not buy a Drug if the drug is not in the received state", async () => {
					await supplyChain.connect(manufacturer).createDrug("drug1", 100)
					await supplyChain.connect(distributor).shipDrug(0)
					await expect(
						supplyChain.connect(pataint).buyDrug(0)
					).to.be.revertedWith("Drug is not available for purchase")
				})
			})
	  })
