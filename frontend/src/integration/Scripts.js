import { ethers } from "ethers";

const contractAddress = import.meta.env.VITE_CONTRACT;
const RPC = import.meta.env.VITE_RPC;

const abi = [
  "function createUser() public",
  "function createOffer(uint256 _listingId, uint256 _price) public payable",
  "function createListing(uint256 _price) public",
  "function deleteUser(address _userAddress) external",
  "function fulfillListing(uint256 _listingId) public",
  "event ItemCreated(address indexed seller, uint256 indexed itemId, uint256 indexed price)",
  "event BidSuccessful(address indexed bidder, uint256 indexed itemId, uint256 indexed bidId)",
  "event BidAccepted(uint256 indexed itemId, uint256 indexed winningBidId, uint256 indexed price)",
  "event UserCreated(address indexed userId)",
  "event UserDeleted(address indexed userId)",
  "function isValidUser() public view returns (bool)",
  "function getListingPrice(uint256 _listingId) public view returns (uint256)",
];

/**
 * Checks for the browser provider and sends a request to the Metamask provider
 * @returns contractInstance, walletProvider, walletAddress
 */
async function getWeb3() {
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
    return err;
  }
}

export const web3Object = await getWeb3();
const contractInstance = web3Object.contractInstance;
export const walletAddress = web3Object.address;

export const rpcProvider = new ethers.JsonRpcProvider(RPC);
/**
 * WARNING: Development only function, add deadlines in production and fulfills
 * the listing with the given ID, can only be done by the listing creator
 * @param {String} _listingId
 */
export async function FulfillListingOnChain(_listingId) {
  try {
    const transaction = await contractInstance.fulfillListing(_listingId);
    transaction.wait();
    return;
  } catch (err) {
    return err;
  }
}

/**
 * Function to check the validity of a user
 * @returns Boolean value referring to the user's validity
 */
export async function checkValidUser() {
  try {
    const transaction = await contractInstance.isValidUser();
    return transaction;
  } catch (err) {}
}

/**
 * Creates an user on-chain
 * @returns Error object for further error handling
 */
export async function CreateUserOnChain() {
  try {
    const transaction = await contractInstance.createUser();
    transaction.wait();
  } catch (err) {
    return err;
  }
}

/**
 * Create a new listing on-chain with the given initial listing price
 * @param {Number} _price Initial listing price
 */
export async function CreateListingOnChain(_price) {
  try {
    const PriceInWei = ethers.parseUnits(_price.toString(), "gwei");
    const transaction = await contractInstance.createListing(PriceInWei);
    transaction.wait();
  } catch (err) {
    return err;
  }
}

/**
 * Creates a bid on the listing
 * @param {*} _listingId The Listing to bid on
 * @param {*} Price Bidding Price
 * @returns Error object if any
 */
export async function CreateOfferOnChain(_listingId, Price) {
  try {
    const PriceInGWei = ethers.parseUnits(Price.toString(), "wei");
    const transaction = await contractInstance.createOffer(
      _listingId,
      PriceInGWei,
      { value: PriceInGWei }
    );
    transaction.wait();
  } catch (err) {
    return err;
  }
}

/**
 * Deletes the given user from the mapping by setting isActive false
 * @param {String} userAddress
 */
export async function DeleteUserOnChain(userAddress) {
  try {
    const transaction = await contractInstance.deleteUser(userAddress);
    transaction.wait();
    return;
  } catch (err) {
    return err;
  }
}
/**
 * Get the Event Logs for some filters
 * @param {String} eventSignature Event signature in the format: eventname(typeofparam1, typeofparam2...)
 * @param {Array} topics Filters to be applied, set to null if wildcard acceptance needed
 * @returns Returns the logs obtained
 */
export async function getLogs(eventSignature, topics = []) {
  const logs = await rpcProvider.getLogs({
    address: contractAddress,
    fromBlock: 5674847,
    toBlock: await rpcProvider.getBlockNumber(),
    topics: [ethers.id(eventSignature), ...topics],
    removed: false,
  });
  return logs;
}

/**
 * Event listener to trigger rendering of Create User button
 * @returns Boolean value whether the given User Creation event has emanated for the given user
 */
export async function UserCreatedEventListener() {
  contractInstance.on("UserCreated", (from, to, _amount, event) => {
    return from === walletAddress;
  });
}

/**
 * Returns the price of a particular listing
 * @param {*} _listingId
 * @returns The price of the listing
 */
export async function getPrice(_listingId) {
  try {
    const price = await contractInstance.getListingPrice(_listingId);
    return price;
  } catch (err) {
    return err;
  }
}
