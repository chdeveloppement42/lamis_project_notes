import { Injectable } from '@nestjs/common';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class ContactService {
  constructor(private notificationsService: NotificationsService) {}

  async submit(data: { name: string; email: string; subject: string; message: string }) {
    // Broadcast as notification to all admins
    await this.notificationsService.broadcast({
      type: 'CONTACT_MESSAGE',
      message: `📩 Message de ${data.name} (${data.email}): "${data.subject}"`,
    });

    return { message: 'Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.' };
  }
}
