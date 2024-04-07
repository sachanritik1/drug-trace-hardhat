-- CreateEnum
CREATE TYPE "Role" AS ENUM ('MANUFACTURER', 'DISTRIBUTOR', 'PHARMACY', 'PATIENT');

-- CreateTable
CREATE TABLE "Request" (
    "address" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "approved" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Request_pkey" PRIMARY KEY ("address")
);
