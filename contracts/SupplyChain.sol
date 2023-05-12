// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.8;

//errors

error SupplyChain__NotOwner();
error SupplyChain__LotAlreadyExists();
error SupplyChain__LotDoesNOtExist();
error SupplyChain__NotDistributor();
error SupplyChain__NotManufacturer();
error SupplyChain__NotEnoughETHSent();

//create a smart contract which tracks the supply chain of a drug from the manufacturer to the patient
contract SupplyChain {
	constructor() {
		//set the owner of the contract
		owner = msg.sender;
	}

	enum LotStatus {
		Manufactured,
		SenttoDistributor,
		ReceivedbyDistributor,
		ShippedtoPharmacy,
		ReceivedbyPharmacy,
		PurchasedbyPatient
	}

	struct Lot {
		uint256 lotId;
		address currentOwner;
		string drugName;
		address manufacturer;
		address distributor;
		uint256 quantity;
		uint256 price;
		LotStatus status;
	}

	//mapping from lotId to Lot
	mapping(uint256 => Lot) public lots;

	//state variables
	address public immutable owner;

	//events
	event SuppyChain__LotCreated(
		uint256 lotId,
		address currentOwner,
		string drugName,
		address manufacturer,
		address distributor,
		uint256 quantity,
		uint256 price
	);

	event SupplyChain__SenttoDistributor(uint256 lotId);

	event SupplyChain__ReceivedbyDistributor(uint256 lotId);

	event SupplyChain__ShippedtoPharmacy(uint256 lotId);

	event SupplyChain__ReceivedbyPharmacy(uint256 lotId);

	event SupplyChain__LotBought(address currentOwner, uint256 lotId);

	//modifers

	modifier onlyOwner(address _owner) {
		//check if the caller is the owner of the contract
		if (owner != _owner) {
			revert SupplyChain__NotOwner();
		}
		_;
	}

	modifier onlyCurrentOwner(address _currenrOwner, uint256 _lotId) {
		//check if the caller is the owner of the contract
		if (_currenrOwner != lots[_lotId].currentOwner) {
			revert SupplyChain__NotOwner();
		}
		_;
	}

	modifier lotExists(uint256 _lotId) {
		//check if the lotId exists
		if (lots[_lotId].lotId != _lotId) {
			revert SupplyChain__LotDoesNOtExist();
		}
		_;
	}

	modifier lotNotExist(uint256 _lotId) {
		//check if the lotId exists
		if (lots[_lotId].lotId == _lotId) {
			revert SupplyChain__LotAlreadyExists();
		}
		_;
	}

	//create a function to add a new lot
	function createLot(
		uint256 _lotId,
		string memory _drugName,
		address _manufacturer,
		address _distributor,
		uint256 _quantity,
		uint256 _price
	) public payable onlyOwner(msg.sender) lotNotExist(_lotId) {
		//create a new lot
		Lot memory newLot = Lot({
			lotId: _lotId,
			currentOwner: msg.sender,
			drugName: _drugName,
			manufacturer: _manufacturer,
			distributor: _distributor,
			quantity: _quantity,
			price: _price,
			status: LotStatus.Manufactured
		});

		//add the lot to the mapping
		lots[_lotId] = newLot;
		emit SuppyChain__LotCreated(
			_lotId,
			msg.sender,
			_drugName,
			msg.sender,
			_distributor,
			_quantity,
			_price
		);
	}

	//create a function to send the distributor
	function handOverToDistributor(
		uint256 _lotId,
		address _distributor
	) public payable onlyCurrentOwner(msg.sender, _lotId) lotExists(_lotId) {
		lots[_lotId].status = LotStatus.SenttoDistributor;
		lots[_lotId].currentOwner = _distributor;
		emit SupplyChain__SenttoDistributor(_lotId);
	}

	//create a function to distribute the drug to the pharmacy and update the status
	function distributeDrug(
		uint256 _lotId
	) public payable onlyCurrentOwner(msg.sender, _lotId) lotExists(_lotId) {
		lots[_lotId].status = LotStatus.ReceivedbyDistributor;
		emit SupplyChain__ReceivedbyDistributor(_lotId);
		lots[_lotId].status = LotStatus.ShippedtoPharmacy;
		emit SupplyChain__ShippedtoPharmacy(_lotId);
	}

	//create a function which allows patients to buy lots
	function buyLot(uint256 _lotId) public payable lotExists(_lotId) {
		lots[_lotId].status = LotStatus.ReceivedbyPharmacy;
		emit SupplyChain__ReceivedbyPharmacy(_lotId);

		if (msg.value < lots[_lotId].price) {
			revert SupplyChain__NotEnoughETHSent();
		}

		lots[_lotId].currentOwner = msg.sender;
		lots[_lotId].status = LotStatus.PurchasedbyPatient;
		emit SupplyChain__LotBought(msg.sender, _lotId);
	}

	//create a function to get the lot details
	function getLotDetails(
		uint256 _lotId
	) public view lotExists(_lotId) returns (Lot memory) {
		return lots[_lotId];
	}
}
