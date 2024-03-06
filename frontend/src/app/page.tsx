"use client";

import { ethers } from "ethers";
import React, { useState } from "react";

async function connectToMetaMask() {
  const ethereum = (window as any).ethereum;

  if (typeof ethereum !== "undefined") {
    try {
      await ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.BrowserProvider(ethereum);
      return provider;
    } catch (error) {
      console.error("Access denied:", error);
      return null;
    }
  } else {
    console.error("MetaMask is not installed");
    return null;
  }
}

async function getUserAddress() {
  const provider = await connectToMetaMask();
  if (provider) {
    const signer = await provider.getSigner();
    return signer.address;
  } else {
    return null;
  }
}

export default function Home() {
  const [userAddress, setUserAddress] = useState<string>("");

  async function handleConnect() {
    const address = await getUserAddress();
    if (address) {
      setUserAddress(address);
    }
  }

  return (
    <div>
      {userAddress ? (
        <p>Connected with address: {userAddress}</p>
      ) : (
        <button onClick={handleConnect}>Connect to MetaMask</button>
      )}
    </div>
  );
}
