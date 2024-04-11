

const connectWallet = async () => {
    if (window.ethereum) {
      console.log("Ethereum detected....");
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAddress(accounts[0]);
      }
      catch (err) {
        console.log("Error connecting....");
      }
    }
    else {
      alert("Metamask not detected!!!");
    }
  };