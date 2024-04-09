import { JsonRpcProvider, Wallet, Contract, parseUnits } from 'ethers'
import 'dotenv/config'

const User = "(address walletAddress, string userId, uint256[] listedItems, uint256[] bids, bool isActive)"
const provider = new JsonRpcProvider(process.env.RPC)
const wallet = new Wallet(process.env.privateKey, provider)
const contractInstance = new Contract(process.env.contractAddress, [
    "function createUser(address _userAddress, string memory _userId)",
    "function createOffer(address _Bidder,uint256 _ItemID,uint256 _Price) external",
    "function createItem(address _Creator, uint256 _Price) external payable",
], wallet)

/**
 * Creates an user on-chain
 * @param {String} UserAddress 
 * @param {String} UserID 
 */
export async function CreateUser(UserAddress, UserID) {
    try {
        await contractInstance.createUser(UserAddress, UserID);
        console.log("Created User!!");
    }
    catch (err) {
        console.log("Error in User creation: ", err);
    }
}
/**
 * 
 * @param {String} Creator 
 * @param {Number} Price 
 */
export async function CreateItem(Creator, Price) {
    try {
        Price *= 1000
        const PriceInWei = parseUnits(Price.toString(), 'gwei');
        await contractInstance.createItem(Creator, PriceInWei);
        console.log("Created Item!!");
    }
    catch (err) {
        console.log("Error in Item creation: ", err);
    }
}
/**
 * 
 * @param {String} Bidder 
 * @param {Number} ItemId 
 * @param {Number} Price 
 */
export async function CreateOffer(Bidder, ItemId, Price) {
    try {
        Price *= 1000
        const PriceInWei = parseUnits(Price.toString(), 'gwei');
        const tr = await contractInstance.createOffer(Bidder, ItemId, PriceInWei);
        const rc = tr.wait();
        console.log("Created Bid!!", rc);
    }
    catch (err) {
        console.log("Error in Bid Creation:  ", err);
    }
}


