/*
  Warnings:

  - You are about to drop the column `attempts` on the `OTPVerification` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `isBlocked` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `profilePic` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `User` table. All the data in the column will be lost.
  - You are about to alter the column `phone` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(10)`.
  - You are about to drop the `AuditLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Call` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CallAlert` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CallBilling` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CallEvent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CallLiveState` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Delivery` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DeliveryPartner` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Device` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FeatureFlag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FreeCallUsage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Order` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OrderItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Pandit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PaymentLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Plan` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Product` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Session` table. If the table is not empty, all the data it contains will be lost.
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
ALTER TABLE "Delivery" DROP CONSTRAINT "Delivery_partnerId_fkey";

-- DropForeignKey
ALTER TABLE "Device" DROP CONSTRAINT "Device_userId_fkey";

-- DropForeignKey
ALTER TABLE "FreeCallUsage" DROP CONSTRAINT "FreeCallUsage_userId_fkey";

-- DropForeignKey
ALTER TABLE "OTPVerification" DROP CONSTRAINT "OTPVerification_userId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_userId_fkey";

-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_orderId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_userId_fkey";

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

-- DropIndex
DROP INDEX "User_username_key";

-- AlterTable
ALTER TABLE "OTPVerification" DROP COLUMN "attempts";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "deletedAt",
DROP COLUMN "isBlocked",
DROP COLUMN "profilePic",
DROP COLUMN "username",
ADD COLUMN     "houseNo" TEXT,
ADD COLUMN     "image" TEXT,
ADD COLUMN     "landmark" TEXT,
ADD COLUMN     "pinCode" VARCHAR(6),
ALTER COLUMN "phone" SET DATA TYPE VARCHAR(10);

-- DropTable
DROP TABLE "AuditLog";

-- DropTable
DROP TABLE "Call";

-- DropTable
DROP TABLE "CallAlert";

-- DropTable
DROP TABLE "CallBilling";

-- DropTable
DROP TABLE "CallEvent";

-- DropTable
DROP TABLE "CallLiveState";

-- DropTable
DROP TABLE "Delivery";

-- DropTable
DROP TABLE "DeliveryPartner";

-- DropTable
DROP TABLE "Device";

-- DropTable
DROP TABLE "FeatureFlag";

-- DropTable
DROP TABLE "FreeCallUsage";

-- DropTable
DROP TABLE "Order";

-- DropTable
DROP TABLE "OrderItem";

-- DropTable
DROP TABLE "Pandit";

-- DropTable
DROP TABLE "PaymentLog";

-- DropTable
DROP TABLE "Plan";

-- DropTable
DROP TABLE "Product";

-- DropTable
DROP TABLE "Session";

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

-- AddForeignKey
ALTER TABLE "OTPVerification" ADD CONSTRAINT "OTPVerification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
