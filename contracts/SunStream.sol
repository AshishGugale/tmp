// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract SunStream {
    using SafeMath for uint256;

    address public owner;
    uint256 CurrentItemID;
    bool public locked;

    modifier onlyOwner() {
        require(
            msg.sender == owner,
            "Only the contract owner can call this function"
        );
        _;
    }

    modifier ReentrancyGuard() {
        require(
            !locked,
            "A user is currently accessing the critical section!!"
        );
        locked = true;
        _;
        locked = false;
    }

    constructor() {
        owner = msg.sender;
        CurrentItemID = 1;
        locked = false;
    }

    struct Bid {
        address BidderAddress;
        uint256 BidID;
        string BidderID;
        uint256 ItemID;
        uint256 Price;
        bool IsActive;
    }

    struct Item {
        address SellerAddress;
        uint256 ItemID;
        bool IsActive;
        uint256 Price;
        uint256 AcceptedBidID;
    }

    struct User {
        address UserAddress;
        string UserID;
        uint256[] Items;
        uint256[] Bids;
    }
    /**
    Stores details of each item, indexed by its unique ID.
    */
    mapping(uint256 => Item) Items;

    /**
    Stores details of bids for each item, using a nested mapping structure.
        - The outer mapping uses the item ID as the key.
        - The inner mapping uses a unique bid ID (assigned sequentially) as the key.
    */
    mapping(uint256 => mapping(uint256 => Bid)) Bids;

    /**
    Stores user information, indexed by their wallet address.
    */
    mapping(address => User) Users;

    /**
    Stores the UserIDs, indexed by their wallet address.
    */
    mapping(address => string) UserIDs;

    /**
    Stores the current bid number in use for a particular ItemID
    */
    mapping(uint256 => uint256) CurrentBidNumber;

    event ItemCreated(uint256 ItemID);
    event BidSuccessful(uint256 ItemID, uint256 currBidNumber);
    event BidAccepted(uint256 ItemID, uint256 currBidNumber);
    event UserCreation(string UserID);

    /**
    Creates a new user with the provided address and UserID.
        - Requires the caller to be the contract owner (modifier onlyOwner).
        - Emits a UserCreation event with the user's ID.
    */
    function createUser(address _UserAddress, string memory _UserID)
        external
        onlyOwner
    {
        Users[_UserAddress] = User(
            _UserAddress,
            _UserID,
            new uint256[](0),
            new uint256[](0)
        );
        emit UserCreation(_UserID);
    }

    /**
    Creates a new bid for an item with the specified ID and price.
        - Requires the caller to be the contract owner (modifier onlyOwner).
        - Increments the current bid number for the item.
        - Stores the bid details (bidder address, ID, item ID, price, active flag) in the Bids mapping.
        - Updates the item's current price to the bid price in the Items mapping.
        - Emits a BidSuccessful event with the item ID and current bid number.
    */
    function createBid(
        address _Bidder,
        uint256 _ItemID,
        uint256 _Price
    ) external payable onlyOwner {
        uint256 currBidNumber = CurrentBidNumber[_ItemID];
        CurrentBidNumber[_ItemID]++;
        Bids[_ItemID][currBidNumber] = Bid(
            _Bidder,
            currBidNumber,
            UserIDs[_Bidder],
            _ItemID,
            _Price,
            true
        );
        Items[_ItemID].Price = _Price;
        emit BidSuccessful(_ItemID, currBidNumber);
    }

    /** 
    Creates a new item with the provided creator address and price.
        - Requires the caller to be the contract owner (modifier onlyOwner).
        - Assigns a unique ID to the item using CurrentItemID.
        - Stores the item details (creator address, ID, active flag, price, accepted bid ID) in the Items mapping.
        - Increments CurrentItemID for the next item.
        - Emits an ItemCreated event with the item's ID.
    */
    function createItem(address _Creator, uint256 _Price)
        external
        payable
        onlyOwner
    {
        uint256 currItemNumber = CurrentItemID;
        CurrentItemID++;
        Items[currItemNumber] = Item(_Creator, currItemNumber, true, _Price, 0);
        emit ItemCreated(currItemNumber);
    }

    /**
    Marks an item proposal as fulfilled and transfers the payment to the seller.
        - Requires the caller to be the contract owner (modifier onlyOwner).
        - Prevents reentrancy attacks using the ReentrancyGuard modifier.
        - Validates the item ID and ensures the item is still active.
        - Checks if the contract balance is sufficient to cover the item price.
        - Transfers the item price from the contract to the seller's address.
        - Sets the item's active flag to false in the Items mapping.
        - Updates the accepted bid ID in the Items mapping with the provided _BidID.
        - Emits a BidAccepted event with the item ID and accepted bid ID.
    */
    function fulfillItem(uint256 _ItemID, uint256 _BidID)
        external
        onlyOwner
        ReentrancyGuard
    {
        require(_ItemID > 0 && _ItemID < CurrentItemID, "Invalid Item ID");
        require(Items[_ItemID].IsActive, "Proposal is already fulfilled");
        require(
            getContractBalance() > Items[_ItemID].Price,
            "Not enough balance!!"
        );
        // Transfer fare from contract to the seller (Item creator)
        require(
            payable(Items[_ItemID].SellerAddress).send(Items[_ItemID].Price),
            "Failed to transfer the Bid amount to the seller!!"
        );

        Items[_ItemID].IsActive = false;

        emit BidAccepted(_ItemID, _BidID);
    }
    /**
    Retrieves the current balance of the contract.
        - Requires the caller to be the contract owner (modifier onlyOwner).
        - Returns the contract's balance in Wei. 
    */
    function getContractBalance() public view onlyOwner returns (uint256) {
        return address(this).balance;
    }

    /**
    WARNING: This function is for development purposes only and should be removed in production.
        - Allows the contract owner to withdraw the entire contract balance.
        - Requires the caller to be the contract owner (modifier onlyOwner).
        - Transfers the contract's balance to the owner's address.
    */
    function returnBalance() external onlyOwner {
        uint256 currBal = getContractBalance();
        require(
            payable(owner).send(currBal),
            "Failed to transfer current balance"
        );
    }
}
