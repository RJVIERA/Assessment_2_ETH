import { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [customAmount, setCustomAmount] = useState("");
  const [wcustomAmount, setwCustomAmount] = useState("");

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const accounts = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(accounts);
    }
  };

  const handleAccount = (accounts) => {
    if (accounts.length > 0) {
      console.log("Account connected: ", accounts[0]);
      setAccount(accounts[0]);
    } else {
      console.log("No account found");
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert('MetaMask wallet is required to connect');
      return;
    }
  
    const accounts = await ethWallet.request({ method: 'eth_requestAccounts' });
    handleAccount(accounts);
    
    // once wallet is set we can get a reference to our deployed contract
    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);
 
    setATM(atmContract);
  };

  const getBalance = async () => {
    if (atm) {
      const balanceBigNumber = await atm.getBalance();
      const balanceString = balanceBigNumber.toString();
      const balance = ethers.utils.formatEther(balanceString);
      setBalance(balance);
    }
  };

  const deposit = async () => {
    if (atm) {
      let tx = await atm.deposit(ethers.utils.parseEther("1"));
      await tx.wait();
      getBalance();
    }
  };

  const withdraw = async () => {
    if (atm) {
      let tx = await atm.withdraw(ethers.utils.parseEther("1"));
      await tx.wait();
      getBalance();
    }
  };

  const depositCustom = async () => {
    if (atm && customAmount !== "") {
      try {
        const value = ethers.utils.parseEther(customAmount);
        const tx = await atm.customDeposit(value);
        await tx.wait();
        setCustomAmount(""); // Clear customAmount after successful deposit
        getBalance();
      } catch (error) {
        console.error("Error depositing custom amount:", error);
      }
    }
  };

  const withdrawCustom = async () => {
    if (atm && wcustomAmount !== "") {
      try {
        let tx = await atm.withdraw(ethers.utils.parseEther(wcustomAmount));
        await tx.wait();
        setwCustomAmount(""); // Clear wcustomAmount after successful withdrawal
        getBalance();
      } catch (error) {
        console.error("Error withdrawing custom amount:", error);
      }
    }
  };

  const initUser = () => {
    // Check to see if user has Metamask
    if (!ethWallet) {
      return <p>Please install Metamask in order to use this ATM.</p>;
    }

    // Check to see if user is connected. If not, connect to their account
    if (!account) {
      return <button onClick={connectAccount}>Connect Metamask Wallet</button>;
    }

    if (balance === undefined) {
      getBalance();
    }

    return (
      <div className="user-info">
        <p>Your Account: {account}</p>
        <p>Your Balance: {balance} ETH</p>
        <div className="actions">
          <button onClick={deposit}>Deposit 1 ETH</button>
          <button onClick={withdraw}>Withdraw 1 ETH</button>
          <div className="custom-actions">
            <input
              type="number"
              placeholder="Enter custom deposit amount"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
            />
            <button onClick={depositCustom}>Deposit Custom Amount</button>
          </div>
          <div className="custom-actions">
            <input
              type="number"
              placeholder="Enter custom withdraw amount"
              value={wcustomAmount}
              onChange={(e) => setwCustomAmount(e.target.value)}
            />
            <button onClick={withdrawCustom}>Withdraw Custom Amount</button>
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => { getWallet(); }, []);

  return (
    <main className="container">
      <header><h1>Welcome to the Metacrafters ATM!</h1></header>
      {initUser()}
      <style jsx>{`
        .container {
          padding: 20px;
          text-align: center;
        }

        .user-info {
          margin-top: 20px;
          background-color: #f9f9f9;
          border: 1px solid #ccc;
          border-radius: 5px;
          padding: 20px;
        }

        .actions {
          margin-top: 20px;
        }

        .custom-actions {
          margin-top: 10px;
        }

        input[type="number"] {
          margin-right: 10px;
          padding: 5px;
          border-radius: 5px;
          border: 1px solid #ccc;
        }

        button {
          padding: 10px 20px;
          margin: 0 5px;
          background-color: #4CAF50;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        button:hover {
          background-color: #45a049;
        }
      `}</style>
    </main>
  );
}
