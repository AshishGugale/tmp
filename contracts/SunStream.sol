
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Auction {
    using SafeMath for uint256;

    address public contractOwner;
    bool public locked;
    uint256 internal currentListingNumber;

    modifier onlyOwner() {
        require(
            msg.sender == contractOwner,
            "Only owner can call this function"
        );
        _;
    }

    modifier reentrancyGuard() {
        require(!locked, "Another user is accessing the critical section!");
        locked = true;
        _;
        locked = false;
    }

    constructor() {
        contractOwner = msg.sender;
        locked = false;
        currentListingNumber = 1;
    }

    struct Listing {
        address seller;
        uint256 id;
        bool isActive;
        uint256 price;
        uint256 winningBidId;
        
    }

    struct Offer {
        address bidder;
        uint256 id;
        uint256 listingId;
        uint256 price;
        bool isActive;
    }

    struct User {
        address walletAddress;
        uint256[] listedItems;
        uint256[] bids;
        bool isActive;
    }

    /**
     * Mapping: Contains the Listings identified by their IDs
     */
    mapping(uint256 => Listing) public listings;

    /**
     * Mapping: Contains the offers for a Listing using a nested mapping structure
     * The outer mapping uses the Listing ID as the key
     * The inner mapping uses a unique offer ID
     * Function: Returns the offer on a listing with ID: _listingId and offer with ID: _offerId
     */
    mapping(uint256 => mapping(uint256 => Offer)) public offers;

    function getOffer(uint256 _listingId, uint256 _offerId)
        public
        view
        returns (Offer memory)
    {
        return offers[_listingId][_offerId];
    }

    /**
     * Mapping: Contains the registered Users that can be identified with their wallet address
     * Function: Returns the registered user having address: _walletAddress
     */
    mapping(address => User) public users;

    function getUser(address _walletAddress) public view returns (User memory) {
        return users[_walletAddress];
    }

    /**
     * Mapping: Contains the current bid number in use for a particular Listing
     * Function: Returns the registered user's ID string having address: _walletAddress
     */
    mapping(uint256 => uint256) public currentBidNumber;

    event ItemCreated(address indexed seller, uint256 indexed itemId, uint256 indexed price);
    event BidSuccessful(address indexed bidder, uint256 indexed itemId, uint256 indexed bidId);
    event BidAccepted(uint256 indexed itemId, uint256 indexed winningBidId, uint256 indexed price);
    event UserCreated(address indexed userId);
    event UserDeleted(address indexed userId);

    function createUser()
        public
    {
        address _userAddress = msg.sender;
        require(!users[_userAddress].isActive, "User already exists!!");
        users[_userAddress] = User(
            _userAddress,
            new uint256[](0),
            new uint256[](0),
            true
        );
        emit UserCreated(_userAddress);
    }

    function deleteUser(address _userAddress) external {
        require(msg.sender == _userAddress, "Only the user can delete his ID!!");
        require(users[_userAddress].isActive, "User does not exist");
        users[_userAddress].isActive = false;
        emit UserDeleted(_userAddress);
    }

    function createOffer(
        uint256 _listingId,
        uint256 _price
    ) public 
      payable reentrancyGuard{
        address _bidder = msg.sender;
        require(users[_bidder].isActive, "User does not exist");
        require(_listingId < currentListingNumber && _listingId >= 0, "This listing does not exist");
        require(listings[_listingId].isActive, "This listing has already been fulfilled");
        require(listings[_listingId].price < _price, "Bid must be of a higher price!!");
        uint256 _bidId = ++currentBidNumber[_listingId];
        offers[_listingId][_bidId] = Offer(
            _bidder,
            _bidId,
            _listingId,
            _price,
            true
        );
        listings[_listingId].price = _price;
        listings[_listingId].winningBidId = _bidId;
        users[_bidder].bids.push(_listingId);
        emit BidSuccessful(_bidder, _listingId, _bidId);
    }

    function createListing(uint256 _price)
        public
    {
        uint256 _listingId = currentListingNumber++;
        address _seller = msg.sender;
        require(users[_seller].isActive, "User does not exist");
        listings[_listingId] = Listing(_seller, _listingId, true, _price, currentListingNumber);
        users[_seller].listedItems.push(_listingId);
        emit ItemCreated(_seller, _listingId, _price);
    }

    /**
     * Get the current price of a listing
     */
    function getListingPrice(uint256 _listingId) public view returns (uint256){
        return listings[_listingId].price;
    }

    /**
     * Fulfill the listing given by _listingId
     * Transfer funds to the seller and marked listing inactive
     */
    function fulfillListing(uint256 _listingId)
        public
        reentrancyGuard
    {
        require(msg.sender == listings[_listingId].seller, "Only the seller can trigger this!!");
        require(listings[_listingId].winningBidId > 0, "No one has bid on this yet!!");
        require(listings[_listingId].isActive, "Listing either does not exist of is already fulfilled");
        require(
            getContractBalance() > listings[_listingId].price,
            "Insufficient funds!"
        );
        // Transfer fare from contract to the seller (Listing creator)
        require(
            payable(listings[_listingId].seller).send(
                listings[_listingId].price
            ),
            "Failed to transfer the offer amount to the seller!"
        );

        listings[_listingId].isActive = false;

        emit BidAccepted(_listingId, listings[_listingId].winningBidId, listings[_listingId].price);
    }

    /**
     * Retrieves the current balance of the contract.
     * Requires the caller to be the contract owner (modifier onlyOwner).
     * Returns the contract's balance in Wei.
     */
    function getContractBalance() public view onlyOwner returns (uint256) {
        return address(this).balance;
    }

    /**
     * Returns boolean value denoting the validity of an user
     */
    function isValidUser() public view returns (bool){
        return users[msg.sender].isActive;
    }

    /**
     * WARNING: This function is for development purposes only and should be removed in production.
     * Allows the contract owner to withdraw the entire contract balance.
     * Requires the caller to be the contract owner (modifier onlyOwner).
     * Transfers the contract's balance to the owner's address.
     */
    function returnBalance() external onlyOwner {
        uint256 currBal = getContractBalance();
        require(
            payable(contractOwner).send(currBal),
            "Failed to transfer current balance"
        );
    }
}
