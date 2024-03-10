"use client";
import { ethers } from "ethers";
import React from "react";
import ABI from "@/assets/abi/Supplychain.json";
import { useRouter } from "next/navigation";

export default function Register() {
  const addressRef = React.useRef<HTMLInputElement>(null);
  const provider = (window as any).ethereum;
  const router = useRouter();
  const registerUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (provider) {
      const signer = await provider.getSigner();
      const supplychain = new ethers.Contract(
        "0xFAc3c795f09bC2ccC38071d3C428a74442132AB7",
        ABI,
        signer
      );
      const tx = await supplychain.addManufacturer();
      await tx.wait();
      router.push("/");
    } else {
      console.error("Error registering user");
    }
  };

  return (
    <div className="flex justify-center items-center mt-48">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl mb-4">Register your account here</h2>
        <form onSubmit={registerUser} className="space-y-4">
          <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700"
            >
              Role:
            </label>
            <select
              id="role"
              name="role"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="manufacturer">Manufacturer</option>
              <option value="distributor">Distributor</option>
              <option value="pharmacy">Pharmacy</option>
              <option value="patient">Patient</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
