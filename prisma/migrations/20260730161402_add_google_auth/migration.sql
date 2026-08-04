-- CreateEnum
CREATE TYPE "PoojaMode" AS ENUM ('VIDEO_CALL', 'AT_HOME');

-- CreateEnum
CREATE TYPE "TimeSlot" AS ENUM ('SLOT_8_12', 'SLOT_12_15', 'SLOT_15_19', 'SLOT_19_22');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'FAILED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "AuthProvider" AS ENUM ('PHONE', 'GOOGLE');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "address" TEXT,
ADD COLUMN     "dob" TIMESTAMP(3),
ADD COLUMN     "freeCallMinutes" INTEGER NOT NULL DEFAULT 5,
ADD COLUMN     "freeCallPopupShown" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "gender" "Gender",
ADD COLUMN     "houseNo" TEXT,
ADD COLUMN     "landmark" TEXT,
ADD COLUMN     "pinCode" VARCHAR(6),
ADD COLUMN     "provider" "AuthProvider" NOT NULL DEFAULT 'PHONE',
ALTER COLUMN "phone" DROP NOT NULL,
ALTER COLUMN "name" SET DATA TYPE TEXT;

-- CreateTable
CREATE TABLE "OTPVerification" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "otp" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,

    CONSTRAINT "OTPVerification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "poojaId" INTEGER NOT NULL,
    "poojaTitle" TEXT NOT NULL,
    "poojaMode" "PoojaMode" NOT NULL,
    "poojaImage" TEXT,
    "duration" TEXT,
    "amount" INTEGER NOT NULL,
    "originalPrice" INTEGER,
    "discount" INTEGER,
    "customerName" TEXT NOT NULL,
    "customerPhone" VARCHAR(10) NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "houseNo" TEXT,
    "address" TEXT,
    "landmark" TEXT,
    "pinCode" VARCHAR(6),
    "scheduledDate" TEXT NOT NULL,
    "timeSlot" "TimeSlot" NOT NULL,
    "razorpayOrderId" TEXT NOT NULL,
    "razorpayPaymentId" TEXT,
    "razorpaySignature" TEXT,
    "status" "BookingStatus" NOT NULL DEFAULT 'CONFIRMED',
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PAID',
    "specialRequests" TEXT,
    "panditNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "OTPVerification_identifier_idx" ON "OTPVerification"("identifier");

-- CreateIndex
CREATE UNIQUE INDEX "Booking_bookingId_key" ON "Booking"("bookingId");

-- CreateIndex
CREATE UNIQUE INDEX "Booking_razorpayOrderId_key" ON "Booking"("razorpayOrderId");

-- CreateIndex
CREATE UNIQUE INDEX "Booking_razorpayPaymentId_key" ON "Booking"("razorpayPaymentId");

-- CreateIndex
CREATE INDEX "Booking_userId_idx" ON "Booking"("userId");

-- CreateIndex
CREATE INDEX "Booking_bookingId_idx" ON "Booking"("bookingId");

-- CreateIndex
CREATE INDEX "Booking_scheduledDate_idx" ON "Booking"("scheduledDate");

-- CreateIndex
CREATE INDEX "Booking_status_idx" ON "Booking"("status");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- AddForeignKey
ALTER TABLE "OTPVerification" ADD CONSTRAINT "OTPVerification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
