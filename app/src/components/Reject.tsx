"use client";

import { rejectUser } from "@/app/actions";
type Request = {
  role: string;
  address: string;
};

export default function Reject({ request }: { request: Request }) {
  async function handleClick() {
    await rejectUser(request.address);
  }

  return (
    <button
      className="px-4 py-2 bg-red-500 text-white rounded-md"
      onClick={handleClick}
    >
      Reject
    </button>
  );
}
