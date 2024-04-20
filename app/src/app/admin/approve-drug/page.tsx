"use client";

import Approve from "@/components/Approve";
import Reject from "@/components/Reject";
import { connectToMetaMask } from "@/utils/helper";
import ABI from "@/assets/abi/Supplychain.json";
import { ethers } from "ethers";
import { useEffect, useState } from "react";

export default function Admin() {
  const [drugIds, setDrugIds] = useState([]);
  const [requests, setRequests] = useState<any[]>([]);

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

      const res: Awaited<any> = await supplychain.getDrugIds();
      const requests = await Promise.all(
        Object.values(res).map(async (id: any) => {
          const request = await supplychain.getDrugById(id);
          return request;
        })
      );
      setRequests(Object.values(requests));
    }
    fetchData();
  }, []);

  const handleApprove = async (id: string) => {
    const provider = await connectToMetaMask();
    if (!provider) return;
    // @ts-ignore
    const signer = await provider.getSigner();
    const supplychain = new ethers.Contract(
      "0xFAc3c795f09bC2ccC38071d3C428a74442132AB7",
      ABI,
      signer
    );

    const res = await supplychain.approveDrug(id);
    console.log(res);
  };

  return (
    <div className="p-4">
      <div className=" mx-auto">
        <h2 className="text-2xl font-bold mb-4">Approve Drug Requests</h2>
        <div className="">
          <table className="table-auto w-full">
            <thead>
              <tr>
                <th className="px-4 py-2">#</th>
                <th className="px-4 py-2">Drug Id</th>
                <th className="px-4 py-2">Drug Name</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request, index) => {
                return (
                  <tr key={index} className="bg-white border-b">
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">{request[0].toString()}</td>
                    <td className="px-4 py-2">{request[1]}</td>
                    <td className="px-4 py-2 flex gap-2">
                      <button
                        onClick={() => handleApprove(request[0].toString())}
                      >
                        Approve
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
