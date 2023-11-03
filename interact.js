export const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const addressArray = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const obj = {
          status: "👆🏽 Write a message in the text-field above.",
          address: addressArray[0],
        };
        return obj;
      } catch (err) {
        return {
          address: "",
          status: "😥 " + err.message,
        };
      }
    } else {
      return {
        address: "",
        status: (
          "⚠️ You must install Metamask, a virtual Ethereum wallet, in your browser: " +
          "https://metamask.io/download.html"
        ),
      };
    }
  };
  
  export const getCurrentWalletConnected = async () => {
    if (window.ethereum) {
      try {
        const addressArray = await window.ethereum.request({
          method: "eth_accounts",
        });
        if (addressArray.length > 0) {
          return {
            address: addressArray[0],
            status: "👆🏽 Write a message in the text-field above.",
          };
        } else {
          return {
            address: "",
            status: "🦊 Connect to Metamask using the top right button.",
          };
        }
      } catch (err) {
        return {
          address: "",
          status: "😥 " + err.message,
        };
      }
    } else {
      return {
        address: "",
        status: (
          "⚠️ You must install Metamask, a virtual Ethereum wallet, in your browser: " +
          "https://metamask.io/download.html"
        ),
      };
    }
  };
  
  export const setupListeners = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
      } catch (err) {
        console.error(err);
      }
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          window.location.reload();
        } else {
          document.getElementById("status").innerHTML =
            "🦊 Connect to Metamask using the top right button.";
        }
      });
    } else {
      document.getElementById("status").innerHTML =
        "⚠️ You must install Metamask, a virtual Ethereum wallet, in your browser: " +
        "https://metamask.io/download.html";
    }
  };