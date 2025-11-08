import { Body, Controller, Post } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { PrismaService } from '../prisma/prisma.service';

@Controller('notifications')
export class NotificationsController {
  constructor(
    private svc: NotificationsService,
    private prisma: PrismaService,
  ) {}

  @Post('subscribe')
  async subscribe(@Body() body: any) {
    const { vehicleId, subscription } = body;

    if (!vehicleId || !subscription) {
      return { ok: false, message: 'Missing vehicleId or subscription' };
    }

    // 🔍 Find the vehicle and its owner
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id: Number(vehicleId) },
      select: { ownerId: true },
    });

    if (!vehicle || !vehicle.ownerId) {
      return { ok: false, message: 'Owner not found for vehicle' };
    }

    // ✅ Save the subscription for that owner
    await this.svc.saveSubscription(vehicle.ownerId, subscription);

    return { ok: true };
  }
}