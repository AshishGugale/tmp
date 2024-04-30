import { ethers } from "ethers";

const contractAddress = import.meta.env.VITE_CONTRACT;
const RPC = import.meta.env.VITE_RPC;

const abi = [
  "function createProposal(uint256 floatId) external payable",
  "function floatProposal(uint256 _fare, uint256 _latitudeStart, uint256 _longtitudeStart, uint256 _latitudeEnd, uint256 _longtitudeEnd) public payable",
  "event ProposalCreated(uint256 indexed proposalId, uint256 indexed floatId, address indexed driver)",
  "event FloatStart(uint256 indexed floatId, uint256 indexed lat, uint256 indexed long)",
  "event FloatEnd(uint256 indexed floatId, uint256 indexed lat, uint256 indexed long)",
  "event FloatCreated(uint256 indexed floatId, uint256 indexed fare)",
  "function checkFulfilment(uint256 _id) public view returns (bool)",
  "function withdrawFunds(uint256 _proposalId) external",
  "function markFulfilment(uint256 _proposalId) external",
  "event UserCreated(address indexed userAddr)",
  "function createUser() public",
  "function getUserIsActive() public view returns (bool)",
  "function getFloatLatitudeEnd(uint256 floatId) public view returns (uint256)",
  "function getFloatLatitudeStart(uint256 floatId) public view returns (uint256)",
  "function getFloatLongtitudeEnd(uint256 floatId) public view returns (uint256)",
  "function getFloatLongtitudeStart(uint256 floatId) public view returns (uint256)",
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

export async function markFulfilmentOnChain(proposalId) {
  try {
    const transaction = await contractInstance.markFulfilment(proposalId);
    transaction.wait().then(() => {
      console.log("Marked Fulfilled!!");
    });
    return;
  } catch (err) {
    return err;
  }
}

export async function checkValidUser() {
  try {
    const transaction = await contractInstance.getUserIsActive();
    console.log("User is: ", transaction);
    return transaction;
  } catch (err) {}
}

export async function CreateUserOnChain() {
  try {
    const transaction = await contractInstance.createUser();
    transaction.wait().then(() => {
      console.log("User Created!");
    });
  } catch (err) {
    return err;
  }
}

export async function CreateProposalOnChain(floatID) {
  try {
    const transaction = await contractInstance.createProposal(floatID);
    transaction.wait().then(() => {
      "Proposal Created!";
    });
  } catch (err) {
    return err;
  }
}

export async function FloatProposalOnChain(
  fare,
  latStart,
  longStart,
  latEnd,
  longEnd
) {
  try {
    fare *= 1e15;
    const PriceInGWei = ethers.parseUnits(fare.toString(), "wei");
    const transaction = await contractInstance.floatProposal(
      fare,
      latStart,
      longStart,
      latEnd,
      longEnd,
      { value: PriceInGWei }
    );
    transaction.wait().then(() => {
      console.log("Floated!");
    });
  } catch (err) {
    return err;
  }
}

export async function withdrawFundsOnChain(proposalID) {
  try {
    const tx = await contractInstance.withdrawFunds(proposalID);
    tx.wait().then(() => {
      console.log("Withdrawn!!");
    });
  } catch (err) {
    console.log(err);
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

export async function getPrice(_listingId) {
  try {
    const price = await contractInstance.getListingPrice(_listingId);
    return price;
  } catch (err) {
    return err;
  }
}

export async function getFloatLatitudeEndOnChain(floatID) {
  try {
    const tx = await contractInstance.getFloatLatitudeEnd(floatID);
    return tx;
  } catch (err) {
    console.log(err);
  }
}
export async function getFloatLatitudeStartOnChain(floatID) {
  try {
    const tx = await contractInstance.getFloatLatitudeStart(floatID);
    return tx;
  } catch (err) {
    console.log(err);
  }
}
export async function getFloatLongtitudeStartOnChain(floatID) {
  try {
    const tx = await contractInstance.getFloatLongtitudeStart(floatID);
    return tx;
  } catch (err) {
    console.log(err);
  }
}
export async function getFloatLongtitudeEndOnChain(floatID) {
  try {
    const tx = await contractInstance.getFloatLongtitudeEnd(floatID);
    return tx;
  } catch (err) {
    console.log(err);
  }
}
