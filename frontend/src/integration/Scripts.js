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

export const web3Object = await getWeb3();
const contractInstance = web3Object.contractInstance;
const provider = web3Object.provider;
export const walletAddress = web3Object.address;

export const rpcProvider = new ethers.JsonRpcProvider(RPC);
/**
 * WARNING: Development only function, add deadlines in Production
 * Fulfills the listing with the given ID, can only be done by the listing creator
 * @param {String} _listingId
 * @param {String} _offerId
 */
export async function FulfillListingOnChain(_listingId) {
  try {
    const transaction = await contractInstance.fulfillListing(_listingId);
    transaction.wait().then(() => {
      console.log("Listing Fulfilled!!");
    });
  } catch (err) {
    console.log("Error in Fulfilling the listing: ", err);
  }
}
/**
 * Instantaneous hai ye toh no need to perform transaction.wait()!!
 */
export async function checkValidUser() {
  try {
    const transaction = await contractInstance.isValidUser();
    return transaction;
  } catch (err) {
    console.log(err);
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
export async function CreateListingOnChain(_price) {
  try {
    const PriceInWei = ethers.parseUnits(_price.toString(), "gwei");
    const transaction = await contractInstance.createListing(PriceInWei);
    transaction.wait();
  } catch (err) {
    return err;
  }
}

export async function CreateOfferOnChain(_listingId, Price) {
  try {
    const PriceInGWei = ethers.parseUnits(Price.toString(), "gwei");
    const transaction = await contractInstance.createOffer(
      _listingId,
      PriceInGWei,
      { value: PriceInGWei }
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
  return logs;
}

export async function EventListener(eventSignature, topics = []) {
  contractInstance.on(
    {
      address: contractAddress,
      topics: [ethers.id(eventSignature), ...topics],
    },
    (from, to, _amount, event) => {
      console.log(event);
      return event;
    }
  );
}

export async function getPrice(_listingId) {
  try {
    const price = await contractInstance.getListingPrice(_listingId);
    return price;
  } catch (err) {
    console.log("Error in price retrieval: ", err);
  }
}
