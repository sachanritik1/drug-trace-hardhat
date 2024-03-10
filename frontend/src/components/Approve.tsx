"use client";

import { connectToMetaMask } from "@/utils/helper";
import { ethers } from "ethers";
import ABI from "@/assets/abi/Supplychain.json";

type Request = {
  role: string;
  public_address: string;
};

export default function Approve({ request }: { request: Request }) {
  async function handleClick() {
    try {
      const provider = await connectToMetaMask();
      if (!provider) return;
      const signer = await provider.getSigner();
      const userAddress = signer.address;
      const supplychain = new ethers.Contract(
        "0xFAc3c795f09bC2ccC38071d3C428a74442132AB7",
        ABI,
        signer
      );
      let res;
      if (request.role === "Manufacturer") {
        res = await supplychain.addManufacturer(request.public_address);
      } else if (request.role === "Distributor") {
        res = await supplychain.addDistributor(request.public_address);
      } else if (request.role === "Patient") {
        res = await supplychain.addPatient(request.public_address);
      } else if (request.role === "Pharmacy") {
        res = await supplychain.addPharmacy(request.public_address);
      } else {
        console.log("Invalid role");
        return;
      }
      await res.wait();
      console.log(res);
    } catch (error) {
      console.log("Error calling function:", error);
    }
  }

  return (
    <button
      className="px-4 py-2 bg-blue-500 text-white rounded-md"
      onClick={handleClick}
    >
      Approve
    </button>
  );
}
