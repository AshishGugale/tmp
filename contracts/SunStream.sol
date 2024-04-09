// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Auction {
    using SafeMath for uint256;

    address public contractOwner;
    uint256 public nextItemId;
    bool public locked;

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
        nextItemId = 1;
        locked = false;
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
        string bidderId;
        uint256 listingId;
        uint256 price;
        bool isActive;
    }

    struct User {
        address walletAddress;
        string userId;
        uint256[] listedItems;
        uint256[] bids;
        bool isActive;
    }

    /**
     * Mapping: Contains the Listings identified by their IDs
     * Function: Returns the Listing for a given ID
     */
    mapping(uint256 => Listing) public listings;

    function getListing(uint256 _listingId)
        public
        view
        returns (Listing memory)
    {
        return listings[_listingId];
    }

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
     * Mapping: Contains the registered Users' ID strings that can be identified with their wallet address
     * Function: Returns the registered user's ID string having address: _walletAddress
     */
    mapping(address => string) public userIds;

    function getUserID(address _walletAddress)
        public
        view
        returns (string memory)
    {
        return userIds[_walletAddress];
    }

    /**
     * Mapping: Contains the current bid number in use for a particular Listing
     * Function: Returns the registered user's ID string having address: _walletAddress
     */
    mapping(uint256 => uint256) public currentBidNumber;

    event ItemCreated(uint256 itemId);
    event BidSuccessful(uint256 itemId, uint256 currentBidNumber);
    event BidAccepted(uint256 itemId, uint256 winningBidId);
    event UserCreated(string userId);

    function createUser(address _userAddress, string memory _userId)
        external
        onlyOwner
    {
        users[_userAddress] = User(
            _userAddress,
            _userId,
            new uint256[](0),
            new uint256[](0),
            true
        );
        userIds[_userAddress] = _userId;
        emit UserCreated(_userId);
    }

    function deleteUser(address _userAddress) external onlyOwner {
        users[_userAddress].isActive = false;
    }

    function createOffer(
        address _bidder,
        uint256 _listingId,
        uint256 _price
    ) external payable onlyOwner returns (uint256) {
        require(users[_bidder].isActive, "User has deleted account");
        uint256 currBidNumber = currentBidNumber[_listingId];
        currentBidNumber[_listingId]++;
        offers[_listingId][currBidNumber] = Offer(
            _bidder,
            currBidNumber,
            userIds[_bidder],
            _listingId,
            _price,
            true
        );
        listings[_listingId].price = _price;
        users[_bidder].bids.push(_listingId);
        emit BidSuccessful(_listingId, currBidNumber);
        return currBidNumber;
    }

    function createListing(address _seller, uint256 _price)
        external
        payable
        onlyOwner
    {
        uint256 listingId = nextItemId;
        nextItemId++;
        listings[listingId] = Listing(_seller, listingId, true, _price, 0);
        users[_seller].listedItems.push(listingId);
        emit ItemCreated(listingId);
    }

    function fulfillListing(uint256 _listingId, uint256 _offerId)
        external
        onlyOwner
        reentrancyGuard
    {
        require(
            _listingId > 0 && _listingId < nextItemId,
            "Invalid listing ID"
        );
        require(listings[_listingId].isActive, "Listing already fulfilled");
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
        listings[_listingId].winningBidId = _offerId;

        emit BidAccepted(_listingId, _offerId);
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
