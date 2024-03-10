"use client";
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import ABI from "@/assets/abi/Supplychain.json";
import { useRouter } from "next/navigation";
import { useRecoilState, useSetRecoilState } from "recoil";
import { providerAtom } from "@/store/atoms";

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

export default function Header() {
  const router = useRouter();
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const setProvider = useSetRecoilState(providerAtom);

  async function handleConnect() {
    const provider = await connectToMetaMask();
    setProvider(provider);
    if (!provider) return;
    const userAddress = (await provider.getSigner()).address;
    setUserAddress(userAddress);
  }

  useEffect(() => {
    handleConnect();
  }, []);

  async function callContractFunction() {
    try {
      const provider = await connectToMetaMask();

      const supplychain = new ethers.Contract(
        "0xFAc3c795f09bC2ccC38071d3C428a74442132AB7",
        ABI,
        provider
      );
      const owner = await supplychain.owner();
      const isManufacturer = await supplychain.isManufacturer(userAddress);
      const isDistributor = await supplychain.isDistributor(userAddress);
      const isPatient = await supplychain.isPatient(userAddress);
      const isPharmacy = await supplychain.isPharmacy(userAddress);
      if (userAddress === owner) {
        router.push("/admin");
      } else if (isManufacturer) {
        router.push("/manufacturer");
      } else if (isDistributor) {
        router.push("/distributor");
      } else if (isPatient) {
        router.push("/patient");
      } else if (isPharmacy) {
        router.push("/pharmacy");
      } else {
        router.push("/register");
      }
    } catch (error) {
      console.error("Error calling function:", error);
    }
  }

  useEffect(() => {
    if (!userAddress) return;
    callContractFunction();
  }, [userAddress]);

  return (
    <header className="fixed top-0 left-0 right-0 px-4 py-2 bg-blue-600 text-white flex flex-col md:flex-row items-center justify-between">
      <Link href="/" className="text-2xl font-bold">
        Drug Trace
      </Link>
      {userAddress ? (
        <p className="text-lg">Connected with address: {userAddress}</p>
      ) : (
        <button
          className="px-4 py-2 rounded bg-white text-blue-600 hover:bg-blue-100"
          onClick={handleConnect}
        >
          Connect to MetaMask
        </button>
      )}
    </header>
  );
}
