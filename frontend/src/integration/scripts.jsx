import { ethers } from "ethers";

const contractAddress = import.meta.env.VITE_contractAddress;
const RPC = import.meta.env.VITE_RPC;

const abi = [
  "function createUser() public",
  "function createOffer(address _bidder, string memory _bidId, string memory _listingId, uint256 _price) public payable",
  "function createListing(uint256 _price, string memory _listingId) public",
  "function deleteUser(address _userAddress) external",
  "function fulfillListing(string memory _listingId, string memory _offerId) public",
];

const getWeb3 = async () => {
  try {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contractInstance = new ethers.Contract(
        contractAddress,
        abi,
        signer
      );
      const address = await signer.getAddress();
      return { contractInstance, provider, address };
    } else {
      alert("No metamask found!!");
    }
  } catch (err) {
    console.log(err);
  }
};

const web3Object = await getWeb3();
const contractInstance = web3Object.contractInstance;
const provider = web3Object.provider;
export const walletAddress = web3Object.address;
const rpcProvider = new ethers.JsonRpcProvider(RPC);
/**
 * WARNING: Development only function, add deadlines in Production
 * Fulfills the listing with the given ID, can only be done by the listing creator
 * @param {String} _listingId
 * @param {String} _offerId
 */
export async function FulfillListingOnChain(_listingId, _offerId) {
  try {
    const transaction = await contractInstance.fulfillListing(
      _listingId,
      _offerId
    );
    transaction.wait().then(() => {
      console.log("Listing Fulfilled!!");
    });
  } catch (err) {
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
    });
  } catch (err) {
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
    _price *= 1000;
    const PriceInWei = parseUnits(_price.toString(), "gwei");
    const transaction = await contractInstance.createListing(
      PriceInWei,
      _listingId
    );
    transaction.wait().then(() => {
      console.log("Created Item!!");
    });
  } catch (err) {
    console.log("Error in Item creation: ", err);
  }
}

export async function CreateOfferOnChain(bidder, bidId, _listingId, Price) {
  try {
    const PriceInWei = parseUnits(Price.toString(), "gwei");
    const transaction = await contractInstance.createOffer(
      bidder,
      bidId,
      _listingId,
      PriceInWei,
      { value: PriceInWei }
    );
    transaction.wait().then(() => {
      console.log("Created Bid!!");
    });
  } catch (err) {
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
    });
  } catch (err) {
    console.log("Error in User Deletion: ", err);
  }
}
/**
 * Get the Event Logs for some filters
 * @param {String} eventSignature Event signature in the format: eventname(typeofparam1, typeofparam2...)
 * @param {Array} topics filters to be applied, set to null if wildcard acceptance needed
 *
 */
export async function getLogs(eventSignature, topics = []) {
  const logs = await rpcProvider.getLogs({
    address: contractAddress,
    fromBlock: 5674847,
    toBlock: await rpcProvider.getBlockNumber(),
    topics: [ethers.id(eventSignature), ...topics],
    removed: false,
  });
  console.log(logs);
  return logs;
}
