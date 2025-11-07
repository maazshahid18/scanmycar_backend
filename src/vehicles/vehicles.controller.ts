import { Controller, Post, Body, Get, Param, Query } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';

@Controller('vehicles')
export class VehiclesController {
  constructor(private vehiclesService: VehiclesService) {}

  @Post('register')
  register(@Body() body: any) {
    return this.vehiclesService.registerVehicle(body);
  }

  @Get('lookup')
  lookupVehicle(
    @Query('vehicleNumber') vehicleNumber: string,
    @Query('mobileNumber') mobileNumber: string,
  ) {
    return this.vehiclesService.lookupVehicle(vehicleNumber, mobileNumber);
  }

  @Get('owner/:ownerId')
  getOwnerVehicles(@Param('ownerId') ownerId: string) {
    return this.vehiclesService.getByOwner(Number(ownerId));
  }

  @Get(':qrCodeId')
  getVehicle(@Param('qrCodeId') qrCodeId: string) {
    return this.vehiclesService.getByQrId(qrCodeId);
  }
}
