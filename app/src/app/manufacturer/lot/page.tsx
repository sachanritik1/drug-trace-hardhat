"use client";

import { connectToMetaMask } from "@/utils/helper";
import ABI from "@/assets/abi/Supplychain.json";
import { ethers } from "ethers";
import { useEffect, useState, useRef } from "react";
import Modal from "@/components/Modal";

export default function LotPage() {
  const [requests, setRequests] = useState<any[]>([]);
  let [isOpen, setIsOpen] = useState<boolean>(false);
  const quantityRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
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

  const createLot = async (id: bigint, name: string, quantity: number) => {
    const provider = await connectToMetaMask();
    if (!provider) return;
    // @ts-ignore
    const signer = await provider.getSigner();
    const supplychain = new ethers.Contract(
      "0xFAc3c795f09bC2ccC38071d3C428a74442132AB7",
      ABI,
      signer
    );

    const res = await supplychain.manufacturLot(name, quantity, id);
    return res;
  };

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  const handleMakeLot = async () => {
    const id = currentId;
    const res = await createLot(
      id,
      String(nameRef.current?.value),
      Number(quantityRef.current?.value)
    );
    if (res) {
      closeModal();
    }
  };

  return (
    <div className="p-4">
      <div className=" mx-auto">
        <h2 className="text-2xl font-bold mb-4">Make Lot of Drugs:</h2>
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
                        onClick={() => {
                          setCurrentId(BigInt(request[0]));
                          openModal();
                        }}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                      >
                        Make lot
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isOpen} closeModal={closeModal} title={"Create Lot"}>
        <div>
          <input
            className="border-2 px-2"
            type="text"
            placeholder="enter lot name"
            ref={nameRef}
          />

          <input
            className="border-2 px-2"
            type="number"
            placeholder="enter quantity"
            ref={quantityRef}
          />
          <div className="mt-4">
            <button
              type="button"
              className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              onClick={handleMakeLot}
            >
              Create Lot
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
