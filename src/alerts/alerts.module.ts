import { Module } from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { AlertsController } from './alerts.controller';
import { NotificationsModule } from '../notifications/notifications.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    NotificationsModule, // ✅ Enables sending notifications and handling replies
  ],
  controllers: [AlertsController],
  providers: [AlertsService],
  exports: [AlertsService], // ✅ Allow usage in other modules if needed
})
export class AlertsModule {}