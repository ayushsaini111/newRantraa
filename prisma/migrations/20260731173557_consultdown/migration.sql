/*
  Warnings:

  - You are about to drop the `Call` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CallBilling` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CallEvent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CallLiveState` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Order` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OrderItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Pandit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Plan` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Transaction` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserPlan` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Wallet` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Call" DROP CONSTRAINT "Call_callLiveStateId_fkey";

-- DropForeignKey
ALTER TABLE "Call" DROP CONSTRAINT "Call_panditId_fkey";

-- DropForeignKey
ALTER TABLE "Call" DROP CONSTRAINT "Call_userId_fkey";

-- DropForeignKey
ALTER TABLE "CallBilling" DROP CONSTRAINT "CallBilling_callId_fkey";

-- DropForeignKey
ALTER TABLE "CallBilling" DROP CONSTRAINT "CallBilling_transactionId_fkey";

-- DropForeignKey
ALTER TABLE "CallEvent" DROP CONSTRAINT "CallEvent_callId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_userId_fkey";

-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_orderId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_userId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_walletId_fkey";

-- DropForeignKey
ALTER TABLE "UserPlan" DROP CONSTRAINT "UserPlan_planId_fkey";

-- DropForeignKey
ALTER TABLE "UserPlan" DROP CONSTRAINT "UserPlan_userId_fkey";

-- DropForeignKey
ALTER TABLE "Wallet" DROP CONSTRAINT "Wallet_userId_fkey";

-- DropTable
DROP TABLE "Call";

-- DropTable
DROP TABLE "CallBilling";

-- DropTable
DROP TABLE "CallEvent";

-- DropTable
DROP TABLE "CallLiveState";

-- DropTable
DROP TABLE "Order";

-- DropTable
DROP TABLE "OrderItem";

-- DropTable
DROP TABLE "Pandit";

-- DropTable
DROP TABLE "Plan";

-- DropTable
DROP TABLE "Transaction";

-- DropTable
DROP TABLE "UserPlan";

-- DropTable
DROP TABLE "Wallet";

-- DropEnum
DROP TYPE "BillingType";

-- DropEnum
DROP TYPE "CallStatus";

-- DropEnum
DROP TYPE "PlanType";
