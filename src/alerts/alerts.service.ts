import { Injectable } from '@nestjs/common';
import { NotificationsService } from '../notifications/notifications.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AlertsService {
  constructor(
    private prisma: PrismaService,
    private notifications: NotificationsService,
  ) {}

  async sendAlert(vehicleId: number, message: string) {
    // Fetch vehicle with owner
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id: vehicleId },
      include: { owner: true },
    });

    if (!vehicle || !vehicle.owner) {
      throw new Error('Vehicle or owner not found');
    }

    const alert = await this.prisma.alert.create({
      data: {
        message,
        vehicle: { connect: { id: vehicleId } },
        user: { connect: { id: vehicle.owner.id } },
      },
    });

    // ✅ Trigger Push Notification
    try {
      await this.notifications.sendToUser(vehicle.owner.id, {
        title: `ScanMyCar: ${vehicle.vehicleNumber}`,
        body: message,
        url: `/dashboard`,
        alertId: alert.id, // ✅ Include alert ID for reply tracking
      });
    } catch (err) {
      console.error('Push notification failed:', err?.message || err);
    }

    return alert;
  }

  // ✅ New method to handle quick replies
  async addReply(alertId: number, reply: string) {
    // Validate if alert exists
    const alert = await this.prisma.alert.findUnique({ where: { id: alertId } });
    if (!alert) {
      throw new Error('Alert not found');
    }

    // Update alert with reply
    const updatedAlert = await this.prisma.alert.update({
      where: { id: alertId },
      data: { reply },
    });

    // Notify original sender if needed (future improvement)
    console.log(`Reply added to alert ${alertId}: ${reply}`);

    return updatedAlert;
  }
}