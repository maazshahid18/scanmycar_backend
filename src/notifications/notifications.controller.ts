import { Body, Controller, Post } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private svc: NotificationsService) {}

  @Post('subscribe')
  async subscribe(@Body() body: any) {
    const { userId, subscription } = body;
    await this.svc.saveSubscription(Number(userId), subscription);
    return { ok: true };
  }
}