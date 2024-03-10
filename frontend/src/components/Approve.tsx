"use client";

import { connectToMetaMask } from "@/utils/helper";
import { ethers } from "ethers";
import ABI from "@/assets/abi/Supplychain.json";
import { approveUser } from "@/app/actions";

type Request = {
  role: string;
  address: string;
};

export default function Approve({ request }: { request: Request }) {
  async function handleClick() {
    try {
      const provider = await connectToMetaMask();
      if (!provider) return;
      const signer = await provider.getSigner();
      const supplychain = new ethers.Contract(
        "0xFAc3c795f09bC2ccC38071d3C428a74442132AB7",
        ABI,
        signer
      );
      let res;
      const role = request.role.toLowerCase();
      if (role === "manufacturer") {
        res = await supplychain.addManufacturer(request.address);
      } else if (role === "distributor") {
        res = await supplychain.addDistributor(request.address);
      } else if (role === "patient") {
        res = await supplychain.addPatient(request.address);
      } else if (role === "pharmacy") {
        res = await supplychain.addPharmacy(request.address);
      } else {
        console.log("Invalid role");
        return;
      }
      await res.wait();
      console.log(res);
      await approveUser(request.address);
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
