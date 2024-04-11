import detectEthereumProvider from '@metamask/detect-provider'

const provider = await detectEthereumProvider();
if (!provider) {
    console.log("Error: Please connect your metamask!!!");
}
console.log(provider);