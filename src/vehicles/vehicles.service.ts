import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as QRCode from 'qrcode';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class VehiclesService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
  ) { }

  async registerVehicle(body: any) {
    const { ownerName, ownerMobile, vehicleNumber } = body;

    // Ensure user exists
    const user = await this.usersService.createOrGetUser(ownerName, ownerMobile);

    const qrCodeId = Math.random().toString(36).substring(2, 10);
    const url = `https://scanmycar-frontend.vercel.app/scan/${qrCodeId}`;
    const qrImage = await QRCode.toDataURL(url);

    return this.prisma.vehicle.create({
      data: {
        vehicleNumber,
        qrCodeId,
        qrImage,
        ownerId: user.id,
      },
    });
  }

  async getByQrId(qrCodeId: string) {
    return this.prisma.vehicle.findUnique({
      where: { qrCodeId },
      include: { owner: true },
    });
  }

  async getByOwner(ownerId: number) {
    return this.prisma.vehicle.findMany({
      where: { ownerId },
      orderBy: { id: 'desc' },
    });
  }

  async lookupVehicle(vehicleNumber: string, mobileNumber: string) {
    // Find the vehicle with matching vehicle number and owner's mobile number
    const vehicle = await this.prisma.vehicle.findFirst({
      where: {
        vehicleNumber: vehicleNumber,
        owner: {
          mobile: mobileNumber,
        },
      },
      include: {
        owner: true,
      },
    });

    if (!vehicle) {
      return null;
    }

    // ✅ Log the scan
    await this.logScan(vehicle.id);

    // Return vehicle data with mobile number for notification subscription
    return {
      _id: vehicle.id.toString(),
      ownerId: vehicle.owner.id, // ✅ Include owner ID for frontend
      vehicleNumber: vehicle.vehicleNumber,
      qrCodeId: vehicle.qrCodeId,
      qrImage: vehicle.qrImage,
      mobileNumber: vehicle.owner.mobile,
      emergencyContact: vehicle.owner.emergencyContact, // ✅ Include emergency contact
    };
  }

  /**
   * LOG SCAN
   * Should be called when a QR code is scanned (lookupVehicle)
   */
  async logScan(vehicleId: number) {
    await this.prisma.scanLog.create({
      data: { vehicleId },
    });
  }

  /**
   * GET SCAN STATS (Last 7 Days)
   */
  async getScanStats(ownerId: number) {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const logs = await this.prisma.scanLog.findMany({
      where: {
        vehicle: { ownerId },
        scannedAt: { gte: sevenDaysAgo },
      },
      select: { scannedAt: true },
    });

    // Group by day
    const stats = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const dateStr = d.toLocaleDateString('en-US', { weekday: 'short' });

      const count = logs.filter(l =>
        new Date(l.scannedAt).toDateString() === d.toDateString()
      ).length;

      return { day: dateStr, count };
    });

    return stats;
  }
}
