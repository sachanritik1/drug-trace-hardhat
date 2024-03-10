-- CreateTable
CREATE TABLE "Register" (
    "public_address" TEXT NOT NULL,
    "role" TEXT NOT NULL,

    CONSTRAINT "Register_pkey" PRIMARY KEY ("public_address","role")
);
