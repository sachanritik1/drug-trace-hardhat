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
				retailer,
				consumer,
				notOwner
			beforeEach(async () => {
				const accounts = await ethers.getSigners()
				deployer = accounts[0]
				notOwner = accounts[1]
				distributor = accounts[2]
				retailer = accounts[3]
				consumer = accounts[4]
				await deployments.fixture(["all"])
				supplyChainContract = await ethers.getContract("SupplyChain")
				supplyChain = supplyChainContract.connect(deployer)
			})

			describe("constructor", () => {
				it("sets the owner", async () => {
					expect(await supplyChain.getOwner()).to.equal(deployer.address)
				})
			})

			describe("createLot", () => {
				let lotId,
					lotName,
					lotManufacturer,
					lotDistributor,
					lotQuantity,
					lotPrice

				it("creates a lot", async () => {
					supplyChain = supplyChainContract.connect(deployer)
					lotId = 1
					lotName = "paracetamol"
					lotManufacturer = deployer.address
					lotDistributor = distributor.address
					lotQuantity = 100
					lotPrice = 500
					expect(
						await supplyChain.createLot(
							lotId,
							lotName,
							lotManufacturer,
							lotDistributor,
							lotQuantity,
							lotPrice
						)
					).to.emit(
						"SuppyChain__LotCreated(address,uint256,string,address,address,uint256,uint256)"
					)
				})

				it("reverts if lot already exists", async () => {
					expect(
						await supplyChain.createLot(
							lotId,
							lotName,
							lotManufacturer,
							lotDistributor,
							lotQuantity,
							lotPrice
						)
					).to.be.revertedWith("SupplyChain__LotAlreadyExists()")
				})
				it("can only be called by the owner aka manufacturer", async () => {
					supplyChain = supplyChainContract.connect(notOwner)
					lotId = 2
					lotName = "penicillin"
					lotManufacturer = deployer.address
					lotDistributor = distributor.address
					lotQuantity = 10
					lotPrice = 5000
					await expect(
						supplyChain.createLot(
							lotId,
							lotName,
							lotManufacturer,
							lotDistributor,
							lotQuantity,
							lotPrice
						)
					).to.be.reverted
				})
			})
	  })
