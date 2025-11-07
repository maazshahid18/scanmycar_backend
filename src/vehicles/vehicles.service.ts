import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as QRCode from 'qrcode';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class VehiclesService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
  ) {}

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

    // Return vehicle data with mobile number for notification subscription
    return {
      _id: vehicle.id.toString(),
      vehicleNumber: vehicle.vehicleNumber,
      qrCodeId: vehicle.qrCodeId,
      qrImage: vehicle.qrImage,
      mobileNumber: vehicle.owner.mobile,
    };
  }
}
