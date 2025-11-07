import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';

@Controller('vehicles')
export class VehiclesController {
  constructor(private vehiclesService: VehiclesService) {}

  @Post('register')
  register(@Body() body: any) {
    return this.vehiclesService.registerVehicle(body);
  }

  @Get(':qrCodeId')
  getVehicle(@Param('qrCodeId') qrCodeId: string) {
    return this.vehiclesService.getByQrId(qrCodeId);
  }

  @Get('owner/:ownerId')
  getOwnerVehicles(@Param('ownerId') ownerId: string) {
    return this.vehiclesService.getByOwner(Number(ownerId));
  }
}