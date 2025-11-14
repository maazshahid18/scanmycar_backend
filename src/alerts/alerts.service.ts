import { Injectable } from '@nestjs/common';
import { NotificationsService } from '../notifications/notifications.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AlertsService {
  constructor(
    private prisma: PrismaService,
    private notifications: NotificationsService,
  ) {}

  /**
   * SEND ALERT TO VEHICLE OWNER
   */
  async sendAlert(vehicleId: number, message: string) {
    // Fetch vehicle + owner
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id: vehicleId },
      include: { owner: true },
    });

    if (!vehicle || !vehicle.owner) {
      throw new Error('Vehicle or owner not found');
    }

    const ownerId = vehicle.owner.id;

    // Create alert
    const alert = await this.prisma.alert.create({
      data: {
        message,
        vehicleId,
      },
    });

    // Send push notification
    try {
      await this.notifications.sendToUser(ownerId, {
        title: `ScanMyCar: ${vehicle.vehicleNumber}`,
        body: message,
        url: `/dashboard`,
        alertId: alert.id,
      });
    } catch (err) {
      console.error('Push notification failed:', err?.message || err);
    }

    return alert;
  }

  /**
   * ADD REPLY TO ALERT
   */
  async addReply(alertId: number, reply: string) {
    // Ensure alert exists
    const alert = await this.prisma.alert.findUnique({
      where: { id: alertId },
      include: {
        vehicle: {
          include: { owner: true },
        },
      },
    });

    if (!alert) throw new Error('Alert not found');
    if (!alert.vehicle?.owner)
      throw new Error('Vehicle owner not found for this alert');

    const updatedAlert = await this.prisma.alert.update({
      where: { id: alertId },
      data: ({ reply } as any),
    });

    // Notify sender in future (not implemented yet)
    console.log(`Reply added to alert ${alertId}: ${reply}`);

    return updatedAlert;
  }
}