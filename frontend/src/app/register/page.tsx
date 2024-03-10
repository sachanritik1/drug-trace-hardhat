"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "../actions";
import { connectToMetaMask } from "@/utils/helper";

export default function Register() {
  const [role, setRole] = React.useState<string>("Manufacturer");
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const provider = await connectToMetaMask();
      if (!provider) return;
      const address = (await provider.getSigner()).address;

      const res = await registerUser(role, address);
      if (res) {
        console.log("User registration request sent");
      } else {
        console.log("User registration request failed");
      }
    } catch (error) {
      console.error("Error calling function:", error);
    }
  };

  return (
    <div className="flex justify-center items-center mt-48">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl mb-4">Register your account here</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
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
              onChange={(e) => setRole(e.target.value)}
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
