-- DropForeignKey
ALTER TABLE `Alert` DROP FOREIGN KEY `Alert_userId_fkey`;

-- DropForeignKey
ALTER TABLE `PushSubscription` DROP FOREIGN KEY `PushSubscription_userId_fkey`;

-- DropIndex
DROP INDEX `Alert_userId_fkey` ON `Alert`;

-- DropIndex
DROP INDEX `PushSubscription_userId_fkey` ON `PushSubscription`;

-- AlterTable
ALTER TABLE `Alert` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `reply` VARCHAR(191) NULL,
    MODIFY `userId` INTEGER NULL;

-- AlterTable
ALTER TABLE `PushSubscription` MODIFY `userId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Alert` ADD CONSTRAINT `Alert_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PushSubscription` ADD CONSTRAINT `PushSubscription_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
