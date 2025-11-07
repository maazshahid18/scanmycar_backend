import { Module } from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { AlertsController } from './alerts.controller';
import { NotificationsModule } from '../notifications/notifications.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    NotificationsModule,   // ✅ This fixes dependency injection
  ],
  controllers: [AlertsController],
  providers: [AlertsService],
})
export class AlertsModule {}