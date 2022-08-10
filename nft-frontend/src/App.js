import { useEffect, useState } from "react";
import { ethers } from "ethers";

import contract from "./contracts/NFTCollectible.json";
import "./App.css";
const contractAddress = "0x944C871CD83E9a6ce20c28110eF1ab484E7Ab406";
const abi = contract.abi;

const App = () => {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [images, setImages] = useState([]);
  const checkWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) console.log("Make sure you've just installed MetaMask!");
    else console.log("Wallet exists! We're ready to go!");
    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account: ", account);
      setCurrentAccount(account);
    } else console.log("No authorized account found.");
  };

  const connectWalletHandler = async () => {
    const { ethereum } = window;

    if (!ethereum) alert("Please install MetaMask!");

    try {
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("Found an account! Address: ", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (err) {
      console.log(err);
    }
  };

  const mintNftHandler = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const nftContract = new ethers.Contract(contractAddress, abi, signer);

        console.log("Initialize payment!");
        let nftTxn = await nftContract.mintTo(
          "0x1225A10B8bfbb74252c9BE6Ba88c8F9F928f6f3A",
          {
            value: ethers.utils.parseEther("0.001"),
          }
        );

        console.log("baseURL: ", nftTxn);

        console.log("Mining. Please wait");
        await nftTxn.wait();
        setImages([]);

        console.log(
          `Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`
        );
      } else {
        console.log("Ethereum object does not exist.");
      }
    } catch {
      (err) => console.error(err);
    }
  };

  const connectWalletButton = () => {
    return (
      <button
        onClick={connectWalletHandler}
        className="cta-button connect-wallet-button"
      >
        Connect Wallet
      </button>
    );
  };

  const mintNftButton = () => {
    return (
      <button onClick={mintNftHandler} className="cta-button mint-nft-button">
        Mint NFT
      </button>
    );
  };

  const getTokenImages = async () => {
    const { ethereum } = window;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const nftContract = new ethers.Contract(contractAddress, abi, signer);
    const counts = parseInt(await nftContract.getTokenCount());

    for (let i = 1; i <= counts; i++) {
      const url = await nftContract.tokenURI(i);

      fetch(url)
        .then((res) => res.json())
        .then((results) => setImages((images) => [...images, results]));
    }
  };

  useEffect(() => {
    checkWalletIsConnected();
    getTokenImages();
    setImages([]);
  }, []);

  return (
    <div className="main-app">
      <h1>Kika's Wallet</h1>
      <div>{currentAccount ? mintNftButton() : connectWalletButton()}</div>

      <div className="grid-container">
        {images.map((image, index) => (
          <div key={index} className="d-flex justify-content-center">
            <span>
              <img src={image.image} alt={image.name} width="500"></img>
              <p>{image.description}</p>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
