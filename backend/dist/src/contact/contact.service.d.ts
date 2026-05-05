import { NotificationsService } from '../notifications/notifications.service';
export declare class ContactService {
    private notificationsService;
    constructor(notificationsService: NotificationsService);
    submit(data: {
        name: string;
        email: string;
        subject: string;
        message: string;
    }): Promise<{
        message: string;
    }>;
}
