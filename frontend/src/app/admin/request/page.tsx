import { PrismaClient } from "@prisma/client";
import Approve from "@/components/Approve";

export default async function Admin() {
  const prisma = new PrismaClient();
  const requests = await prisma.register.findMany();

  return (
    <div className="p-4">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Registration Requests</h2>
        <div className="overflow-x-auto">
          <table className="table-auto w-full">
            <thead>
              <tr>
                <th className="px-4 py-2">#</th>
                <th className="px-4 py-2">Role</th>
                <th className="px-4 py-2">Public Address</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request, index) => (
                <tr key={index} className="bg-white border-b">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{request.role}</td>
                  <td className="px-4 py-2">{request.public_address}</td>
                  <td className="px-4 py-2">
                    <Approve request={request} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
