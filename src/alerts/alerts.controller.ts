import { Controller, Post, Body } from '@nestjs/common';
import { AlertsService } from './alerts.service';

@Controller('alerts')
export class AlertsController {
  constructor(private alertsService: AlertsService) {}

  @Post('send')
  async send(@Body() body: any) {
    console.log("Incoming Alert Payload:", body);

    const { vehicleId, message } = body;

    if (!vehicleId || isNaN(Number(vehicleId))) {
      throw new Error("Invalid or missing vehicleId");
    }

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      throw new Error("Invalid or empty message");
    }

    return this.alertsService.sendAlert(Number(vehicleId), message.trim());
  }
}