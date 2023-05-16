// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;

contract DrugSupplyChain {
	address public owner;

	mapping(address => bool) public isManufacturer;
	mapping(address => bool) public isDistributor;
	mapping(address => bool) public isPharmacy;
	mapping(address => bool) public isPatient;

	enum DrugState {
		Created,
		Shipped,
		Received,
		Sold
	}

	struct Drug {
		string name;
		uint256 quantity;
		address manufacturer;
		address distributor;
		address pharmacy;
		address patient;
		DrugState state;
	}

	mapping(uint256 => Drug) public drugs;
	uint256 public drugCount;

	modifier onlyOwner() {
		require(msg.sender == owner, "Only contract owner can perform this action");
		_;
	}

	modifier onlyManufacturer() {
		require(
			isManufacturer[msg.sender],
			"Only approved manufacturers can perform this action"
		);
		_;
	}

	modifier onlyDistributor() {
		require(
			isDistributor[msg.sender],
			"Only approved distributors can perform this action"
		);
		_;
	}

	modifier onlyPharmacy() {
		require(
			isPharmacy[msg.sender],
			"Only approved pharmacies can perform this action"
		);
		_;
	}

	modifier onlyPatient() {
		require(
			isPatient[msg.sender],
			"Only approved patients can perform this action"
		);
		_;
	}

	event DrugCreated(uint256 drugId);
	event DrugShipped(uint256 drugId);
	event DrugReceived(uint256 drugId);
	event DrugSold(uint256 drugId, address patient);

	constructor() {
		owner = msg.sender;
	}

	function addManufacturer(address _manufacturer) public onlyOwner {
		isManufacturer[_manufacturer] = true;
	}

	function addDistributor(address _distributor) public onlyOwner {
		isDistributor[_distributor] = true;
	}

	function addPharmacy(address _pharmacy) public onlyOwner {
		isPharmacy[_pharmacy] = true;
	}

	function addPatient(address _patient) public onlyOwner {
		isPatient[_patient] = true;
	}

	function createDrug(
		string memory _name,
		uint256 _quantity
	) public onlyManufacturer {
		require(_quantity > 0, "Quantity should be greater than zero");

		drugs[drugCount] = Drug({
			name: _name,
			quantity: _quantity,
			manufacturer: msg.sender,
			distributor: address(0),
			pharmacy: address(0),
			patient: address(0),
			state: DrugState.Created
		});
		drugCount++;
		emit DrugCreated(drugCount);
	}

	function shipDrug(
		uint256 _drugId,
		address _distributor
	) public onlyDistributor {
		require(
			drugs[_drugId].state == DrugState.Created,
			"Drug has already been shipped or received"
		);
		drugs[_drugId].distributor = _distributor;
		drugs[_drugId].state = DrugState.Shipped;

		emit DrugShipped(_drugId);
	}

	function receiveDrug(uint256 _drugId, address _pharmacy) public onlyPharmacy {
		require(
			drugs[_drugId].state == DrugState.Shipped,
			"Drug has not been shipped yet"
		);
		drugs[_drugId].pharmacy = _pharmacy;
		drugs[_drugId].state = DrugState.Received;

		emit DrugReceived(_drugId);
	}

	function buyDrug(uint256 _drugId) public onlyPatient {
		require(
			drugs[_drugId].state == DrugState.Received,
			"Drug is not available for purchase"
		);
		require(drugs[_drugId].quantity > 0, "Drug is out of stock");

		drugs[_drugId].patient = msg.sender;
		drugs[_drugId].quantity--;
		emit DrugSold(_drugId, msg.sender);
	}

	//getter functions

	function getDrug(uint256 _drugId) public view returns (Drug memory) {
		return drugs[_drugId];
	}

	function getDrugCount() public view returns (uint256) {
		return drugCount;
	}

	function IsManufacturer(address _manufacturer) public view returns (bool) {
		return isManufacturer[_manufacturer];
	}

	function IsDistributor(address _distributor) public view returns (bool) {
		return isDistributor[_distributor];
	}

	function IsPharmacy(address _pharmacy) public view returns (bool) {
		return isPharmacy[_pharmacy];
	}

	function IsPatient(address _patient) public view returns (bool) {
		return isPatient[_patient];
	}
}
