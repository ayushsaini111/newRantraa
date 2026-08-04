-- CreateEnum
CREATE TYPE "CallStatus" AS ENUM ('INITIATED', 'RINGING', 'ONGOING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "BillingType" AS ENUM ('FREE', 'PLAN', 'WALLET');

-- CreateTable
CREATE TABLE "Pandit" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "dob" TIMESTAMP(3),
    "about" TEXT,
    "speciality" TEXT[],
    "languages" TEXT[],
    "profilePic" TEXT,
    "profilePicPublicId" TEXT,
    "startTime" TEXT NOT NULL DEFAULT '09:00',
    "endTime" TEXT NOT NULL DEFAULT '21:00',
    "breakTime" TEXT NOT NULL DEFAULT '13:00',
    "workingDays" TEXT[] DEFAULT ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']::TEXT[],
    "notificationsConsultationRequests" BOOLEAN NOT NULL DEFAULT true,
    "notificationsMessages" BOOLEAN NOT NULL DEFAULT true,
    "notificationsReminders" BOOLEAN NOT NULL DEFAULT true,
    "notificationsPromotions" BOOLEAN NOT NULL DEFAULT false,
    "ratePerMin" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "fcmToken" TEXT,

    CONSTRAINT "Pandit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wallet" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Wallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Call" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "panditId" TEXT NOT NULL,
    "channelName" TEXT NOT NULL,
    "agoraToken" TEXT,
    "type" TEXT NOT NULL,
    "deletedUsername" TEXT,
    "billingType" "BillingType" NOT NULL DEFAULT 'PLAN',
    "ratePerMinute" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "isFreeCall" BOOLEAN NOT NULL DEFAULT false,
    "freeSeconds" INTEGER NOT NULL DEFAULT 0,
    "paidSeconds" INTEGER NOT NULL DEFAULT 0,
    "status" "CallStatus" NOT NULL DEFAULT 'INITIATED',
    "startTime" TIMESTAMP(3),
    "endTime" TIMESTAMP(3),
    "duration" INTEGER,
    "billableSeconds" INTEGER,
    "totalCost" DOUBLE PRECISION DEFAULT 0,
    "autoEnded" BOOLEAN NOT NULL DEFAULT false,
    "endedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "callLiveStateId" TEXT,

    CONSTRAINT "Call_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CallEvent" (
    "id" TEXT NOT NULL,
    "callId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CallEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CallLiveState" (
    "id" TEXT NOT NULL,
    "callId" TEXT NOT NULL,
    "currentCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "elapsedSec" INTEGER NOT NULL DEFAULT 0,
    "lastSynced" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CallLiveState_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CallBilling" (
    "id" TEXT NOT NULL,
    "callId" TEXT NOT NULL,
    "totalDuration" INTEGER NOT NULL,
    "chargedDuration" INTEGER NOT NULL,
    "totalCost" DOUBLE PRECISION NOT NULL,
    "freeMinutesUsed" INTEGER NOT NULL DEFAULT 0,
    "walletDeducted" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "planUsedMinutes" INTEGER NOT NULL DEFAULT 0,
    "transactionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CallBilling_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "walletId" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "type" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "status" "PaymentStatus" NOT NULL,
    "razorpayOrderId" TEXT,
    "razorpayPaymentId" TEXT,
    "idempotencyKey" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Pandit_username_key" ON "Pandit"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_userId_key" ON "Wallet"("userId");

-- CreateIndex
CREATE INDEX "CallEvent_callId_idx" ON "CallEvent"("callId");

-- CreateIndex
CREATE UNIQUE INDEX "CallLiveState_callId_key" ON "CallLiveState"("callId");

-- CreateIndex
CREATE UNIQUE INDEX "CallBilling_callId_key" ON "CallBilling"("callId");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_idempotencyKey_key" ON "Transaction"("idempotencyKey");

-- AddForeignKey
ALTER TABLE "Wallet" ADD CONSTRAINT "Wallet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Call" ADD CONSTRAINT "Call_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Call" ADD CONSTRAINT "Call_panditId_fkey" FOREIGN KEY ("panditId") REFERENCES "Pandit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Call" ADD CONSTRAINT "Call_callLiveStateId_fkey" FOREIGN KEY ("callLiveStateId") REFERENCES "CallLiveState"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CallEvent" ADD CONSTRAINT "CallEvent_callId_fkey" FOREIGN KEY ("callId") REFERENCES "Call"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CallBilling" ADD CONSTRAINT "CallBilling_callId_fkey" FOREIGN KEY ("callId") REFERENCES "Call"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CallBilling" ADD CONSTRAINT "CallBilling_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE SET NULL ON UPDATE CASCADE;
