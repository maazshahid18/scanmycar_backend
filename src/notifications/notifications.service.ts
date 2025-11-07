import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import * as webPush from 'web-push';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {
    webPush.setVapidDetails(
      process.env.VAPID_SUBJECT as string,
      process.env.VAPID_PUBLIC_KEY as string,
      process.env.VAPID_PRIVATE_KEY as string
    );
  }

  async saveSubscription(userId: number, sub: any) {
    const { endpoint, keys } = sub;
    return this.prisma.pushSubscription.upsert({
      where: { endpoint },
      update: { p256dh: keys.p256dh, auth: keys.auth, userId },
      create: { endpoint, p256dh: keys.p256dh, auth: keys.auth, userId },
    });
  }

  async sendToUser(userId: number, payload: { title: string; body: string; url?: string }) {
    console.log(`[NotificationsService] Sending to user ${userId}:`, payload);
    const subs = await this.prisma.pushSubscription.findMany({ where: { userId } });
    console.log(`[NotificationsService] Found ${subs.length} subscriptions`);
    
    if (subs.length === 0) {
      console.warn(`[NotificationsService] No push subscriptions found for user ${userId}`);
      return;
    }
    
    const jsonPayload = JSON.stringify(payload);

    const results = await Promise.allSettled(
      subs.map(async (s) => {
        try {
          console.log(`[NotificationsService] Sending to endpoint: ${s.endpoint.substring(0, 50)}...`);
          const result = await webPush.sendNotification(
            { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } } as any,
            jsonPayload
          );
          console.log(`[NotificationsService] ✓ Notification sent successfully`);
          return result;
        } catch (e: any) {
          console.error(`[NotificationsService] ✗ web-push error:`, e?.message, e?.body, e?.statusCode);
          if (e?.statusCode === 410 || e?.statusCode === 404) {
            console.log(`[NotificationsService] Deleting expired subscription`);
            await this.prisma.pushSubscription.delete({ where: { endpoint: s.endpoint } });
          }
          throw e;
        }
      })
    );
    
    console.log(`[NotificationsService] Push results:`, results.map(r => r.status));
  }
}