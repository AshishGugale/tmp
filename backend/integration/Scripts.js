import { JsonRpcProvider, Wallet, Contract, parseUnits } from 'ethers'
import 'dotenv/config'

const provider = new JsonRpcProvider(process.env.RPC)

const wallet = new Wallet(process.env.privateKey, provider)
const contractInstance = new Contract(process.env.contractAddress, [
    "function createUser() public",
    "function createOffer(address _bidder, string memory _bidId, string memory _listingId, uint256 _price) public payable",
    "function createListing(uint256 _price, string memory _listingId) public",
    "function deleteUser(address _userAddress) external",
    "function fulfillListing(string memory _listingId, string memory _offerId) public"
], wallet)

/**
 * WARNING: Development only function, add deadlines in Production
 * Fulfills the listing with the given ID, can only be done by the listing creator
 * @param {String} _listingId 
 * @param {String} _offerId 
 */
export async function FulfillListingOnChain(_listingId, _offerId) {
    try {
        const transaction = await contractInstance.fulfillListing(_listingId, _offerId);
        transaction.wait().then(() => {
            console.log("Listing Fulfilled!!");
        })
    }
    catch (err) {
        console.log("Error in Fulfilling the listing: ", err);
    }
}

/**
 * Creates an user on-chain
 */
export async function CreateUserOnChain() {
    try {
        const transaction = await contractInstance.createUser();
        transaction.wait().then(() => {
            console.log("Created User!!");
        })
    }
    catch (err) {
        console.log("Error in User creation: ", err);
    }
}
/**
 * Create a new listing on-chain
 * @param {Number} _price 
 * @param {String} _listingId 
 */
export async function CreateListingOnChain(_price, _listingId) {
    try {
        _price *= 1000
        const PriceInWei = parseUnits(_price.toString(), 'gwei');
        const transaction = await contractInstance.createListing(PriceInWei, _listingId);
        transaction.wait().then(() => {
            console.log("Created Item!!");
        })
    }
    catch (err) {
        console.log("Error in Item creation: ", err);
    }
}
/**
 * 
 * @param {String} bidder 
 * @param {String} bidId 
 * @param {String} _listingIdId 
 * @param {Number} Price 
 */
export async function CreateOfferOnChain(bidder, bidId, _listingIdId, Price) {
    try {
        const PriceInWei = parseUnits(Price.toString(), 'gwei');
        const transaction = await contractInstance.createOffer(bidder, bidId, _listingIdIdId, PriceInWei, {value: PriceInWei});
        transaction.wait().then(() => {
            console.log("Created Bid!!");
        })
    }
    catch (err) {
        console.log("Error in Bid Creation: ", err);
    }
}

/**
 * 
 * @param {String} userAddress 
 */
export async function DeleteUserOnChain(userAddress) {
    try {
        const transaction = await contractInstance.deleteUser(userAddress);
        transaction.wait().then(() => {
            console.log("Successfully Deleted!!");
        })
    }
    catch (err){
        console.log("Error in User Deletion: ", err);
    }
}
