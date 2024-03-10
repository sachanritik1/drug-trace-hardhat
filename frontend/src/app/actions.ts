"use server";
import { PrismaClient } from "@prisma/client";

export async function registerUser(role: string, address: string) {
  try {
    const prisma = new PrismaClient();
    await prisma.register.create({ data: { role, public_address: address } });
    return true;
  } catch (error) {
    console.log("Error calling function:", error);
    return false;
  }
}
