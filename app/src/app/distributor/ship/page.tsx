"use client";

import { connectToMetaMask } from "@/utils/helper";
import ABI from "@/assets/abi/Supplychain.json";
import { ethers } from "ethers";
import { useEffect, useState } from "react";

export default function Ship() {
  const [requests, setRequests] = useState<any[]>([]);
  const [currentId, setCurrentId] = useState<bigint>(BigInt(0));

  useEffect(() => {
    async function fetchData() {
      const provider = await connectToMetaMask();
      if (!provider) return;
      // @ts-ignore
      const signer = await provider.getSigner();
      const supplychain = new ethers.Contract(
        "0xFAc3c795f09bC2ccC38071d3C428a74442132AB7",
        ABI,
        signer
      );

      const res: Awaited<any> = await supplychain.getLotIds();
      const requests = await Promise.all(
        Object.values(res).map(async (id: any) => {
          const request = await supplychain.getLotById(id);
          return request;
        })
      );
      setRequests(Object.values(requests));
      console.log(requests);
    }
    fetchData();
  }, []);

  const receiveLot = async (id: bigint) => {
    const provider = await connectToMetaMask();
    if (!provider) return;
    // @ts-ignore
    const signer = await provider.getSigner();
    const supplychain = new ethers.Contract(
      "0xFAc3c795f09bC2ccC38071d3C428a74442132AB7",
      ABI,
      signer
    );

    const res = await supplychain.receiveDrug(id);
    return res;
  };

  const handleReceiveLot = async () => {
    const id = currentId;
    const res = await receiveLot(id);
  };

  return (
    <div className="p-4">
      <div className=" mx-auto">
        <h2 className="text-2xl font-bold mb-4">Ship Lot of Drugs:</h2>
        <div className="">
          <table className="table-auto w-full">
            <thead>
              <tr>
                <th className="px-4 py-2">#</th>
                <th className="px-4 py-2">Lot Id</th>
                <th className="px-4 py-2">Lot Name</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request, index) => {
                return (
                  <tr key={index} className="bg-white border-b">
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">{request[0].toString()}</td>
                    <td className="px-4 py-2">{request[2]}</td>

                    <td className="px-4 py-2 flex gap-2">
                      <button
                        onClick={handleReceiveLot}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                      >
                        Ship lot
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
