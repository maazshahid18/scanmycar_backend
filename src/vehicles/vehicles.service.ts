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
    const url = `http://localhost:3000/scan/${qrCodeId}`;
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
}