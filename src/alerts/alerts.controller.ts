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
  // ✅ New endpoint for quick replies
  @Post('reply')
  async reply(@Body() body: any) {
    console.log("Incoming Reply Payload:", body);

    const { alertId, reply } = body;

    if (!alertId || isNaN(Number(alertId))) {
      throw new Error("Invalid or missing alertId");
    }

    if (!reply || typeof reply !== "string" || reply.trim().length === 0) {
      throw new Error("Invalid or empty reply");
    }

    return this.alertsService.addReply(Number(alertId), reply.trim());
  }
}