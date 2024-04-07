import { ethers } from "ethers";

export async function connectToMetaMask() {
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
    const provider = ethers.getDefaultProvider();
    return provider;
  }
}
