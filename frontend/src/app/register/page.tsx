"use client";
import { ethers } from "ethers";
import React from "react";
import ABI from "@/assets/abi/Supplychain.json";
import { useRecoilValue } from "recoil";
import { providerAtom } from "@/store/atoms";
import { useRouter } from "next/navigation";

export default function Register() {
  const addressRef = React.useRef<HTMLInputElement>(null);
  const provider = useRecoilValue(providerAtom);
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
    <div>
      <p>Register your account here</p>
      <form onSubmit={registerUser}>
        <label htmlFor="role">Role:</label>
        <select id="role" name="role">
          <option value="manufacturer">Manufacturer</option>
          <option value="distributor">Distributor</option>
          <option value="pharmacy">Pharmacy</option>
          <option value="patient">Patient</option>
        </select>
        <input
          ref={addressRef}
          type="text"
          id="address"
          name="address"
          placeholder="user's public address"
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}
