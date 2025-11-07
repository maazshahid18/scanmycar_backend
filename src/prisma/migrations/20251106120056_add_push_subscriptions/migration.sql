/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Alert` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Alert` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Alert` DROP COLUMN `createdAt`,
    ADD COLUMN `userId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `createdAt`;

-- CreateTable
CREATE TABLE `PushSubscription` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `endpoint` VARCHAR(191) NOT NULL,
    `p256dh` VARCHAR(191) NOT NULL,
    `auth` VARCHAR(191) NOT NULL,
    `userId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `PushSubscription_endpoint_key`(`endpoint`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Alert` ADD CONSTRAINT `Alert_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PushSubscription` ADD CONSTRAINT `PushSubscription_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
