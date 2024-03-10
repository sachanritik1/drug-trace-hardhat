"use server";
import prisma from "@/db/index";
import { $Enums } from "@prisma/client";

export async function registerUser(role: $Enums.Role, address: string) {
  try {
    await prisma.request.create({ data: { role: role, address: address } });
    return true;
  } catch (error) {
    console.log("Error calling function:", error);
    return false;
  }
}

export async function approveUser(address: string) {
  try {
    await prisma.request.update({
      where: {
        address: address,
      },
      data: { approved: true },
    });
    return true;
  } catch (error) {
    console.log("Error calling function:", error);
    return false;
  }
}

export async function rejectUser(address: string) {
  try {
    await prisma.request.delete({ where: { address: address } });
    return true;
  } catch (error) {
    console.log("Error calling function:", error);
    return false;
  }
}
