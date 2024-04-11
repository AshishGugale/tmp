import { JsonRpcProvider, id } from 'ethers'
import 'dotenv/config'

const provider = new JsonRpcProvider(process.env.RPC);
/**
 * Get the Event Logs for some filters 
 * @param {String} contractAddress Address of the deployed contract 
 * @param {Number} fromBlock Initial block number to start retrieving Logs from
 * @param {String} eventSignature Event signature in the format: eventname(typeofparam1, typeofparam2...)
 * @param {Array} topics filters to be applied, set to null if wildcard acceptance needed
 * 
 */
export async function getLogs(contractAddress, fromBlock, eventSignature, topics) {
    const logs = await provider.getLogs({
        address: contractAddress,
        fromBlock: fromBlock,
        toBlock: await provider.getBlockNumber(),
        topics: [id(eventSignature),
            ...topics
        ],
        removed: false
    });
    console.log(logs);
}

/**
 * Add an event listener which unsubscribes once the event occurs once
 * @param {String} contractAddress Address of the deployed contract 
 * @param {String} eventSignature Event signature in the format: eventname(typeofparam1, typeofparam2...)
 * @param {Array} topics filters to be applied, set to null if wildcard acceptance needed
 * 
 */
export async function singleEventListener(contractAddress, fromBlock, eventSignature, topics) {
    const event = provider.once({
        address: contractAddress,
        topics: [id(eventSignature),
            ...topics
        ],
        removed: false
    })
    console.log(event);
}