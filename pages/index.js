import { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [message, setMessage] = useState("");
  const [inputMessage, setInputMessage] = useState("");
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [oddOrEvenResult, setOddOrEvenResult] = useState("");

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Update with your deployed contract address
  const atmABI = atm_abi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
      await window.ethereum.request({ method: "eth_requestAccounts" });
    }
  };

  const handleAccount = (accounts) => {
    if (accounts && accounts.length > 0) {
      console.log("Account connected: ", accounts[0]);
      setAccount(accounts[0]);
    } else {
      console.log("No account found");
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    try {
      const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
      handleAccount(accounts);
      getATMContract();
    } catch (error) {
      console.error("Error connecting MetaMask:", error);
    }
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);
    setATM(atmContract);
  };

  const getBalance = async () => {
    if (atm && account) {
      try {
        const balance = await atm.getBalance(account);
        setBalance(ethers.utils.formatEther(balance));
      } catch (error) {
        console.error("Error fetching balance:", error);
      }
    }
  };

  const deposit = async () => {
    if (atm) {
      try {
        const tx = await atm.deposit({ value: ethers.utils.parseEther("1") });
        await tx.wait();
        getBalance();
      } catch (error) {
        console.error("Error during deposit:", error);
      }
    }
  };

  const withdraw = async () => {
    if (atm) {
      try {
        const tx = await atm.withdraw(ethers.utils.parseEther("1"));
        await tx.wait();
        getBalance();
      } catch (error) {
        console.error("Error during withdraw:", error);
      }
    }
  };

  const updateMessage = async () => {
    if (atm) {
      try {
        const tx = await atm.setMessage(inputMessage);
        await tx.wait();
        const newMessage = await atm.getMessage(account);
        setMessage(newMessage);
        getBalance();
      } catch (error) {
        console.error("Error during message update:", error);
      }
    }
  };

  const checkOddOrEven = async () => {
    if (atm) {
      try {
        const tx = await atm.checkOddOrEven(num1, num2);
        await tx.wait();

        // Listen for the OddOrEvenChecked event
        atm.on("OddOrEvenChecked", (account, result) => {
          if (account === account) {
            setOddOrEvenResult(result);
          }
        });

      } catch (error) {
        console.error("Error checking odd or even:", error);
      }
    }
  };

  const initUser = () => {
    if (!ethWallet) {
      return <p>Please install MetaMask in order to use this ATM.</p>;
    }

    if (!account) {
      return <button onClick={connectAccount}>Connect MetaMask Wallet</button>;
    }

    if (balance === undefined) {
      getBalance();
    }

    return (
      <div>
        <p>Your Account: {account}</p>
        <p>Your Balance: {balance} ETH</p>
        <button onClick={deposit}>Deposit 1 ETH</button>
        <button onClick={withdraw}>Withdraw 1 ETH</button>
        <div>
          <h2>Message</h2>
          <p>{message}</p>
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Enter your message"
          />
          <button onClick={updateMessage}>Set Message</button>
        </div>
        <div>
          <h2>Odd or Even Checker</h2>
          <input
            type="number"
            value={num1}
            onChange={(e) => setNum1(parseInt(e.target.value, 10))}
            placeholder="Enter first number"
          />
          <input
            type="number"
            value={num2}
            onChange={(e) => setNum2(parseInt(e.target.value, 10))}
            placeholder="Enter second number"
          />
          <button onClick={checkOddOrEven}>Check Odd or Even</button>
          <p>Result: {oddOrEvenResult || "Result not available"}</p>
        </div>
      </div>
    );
  };

  useEffect(() => {
    getWallet();
  }, []);

  useEffect(() => {
    if (ethWallet && account) {
      getATMContract();
    }
  }, [ethWallet, account]);

  return (
    <main className="container">
      <header><h1>Welcome to the Metacrafters ATM!</h1></header>
      {initUser()}
      <style jsx>{`
        .container {
          text-align: center;
        }
      `}</style>
    </main>
  );
}
