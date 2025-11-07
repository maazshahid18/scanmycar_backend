import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createOrGetUser(name: string, mobile: string) {
    let user = await this.prisma.user.findUnique({
      where: { mobile },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: { name, mobile },
      });
    }

    return user;
  }

  async getUser(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      include: { vehicles: true },
    });
  }
}