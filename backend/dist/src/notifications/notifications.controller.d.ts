import type { Request } from 'express';
import { NotificationsService } from './notifications.service';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    findAll(req: Request): Promise<{
        id: number;
        createdAt: Date;
        message: string;
        type: import("@prisma/client").$Enums.NotificationType;
        isRead: boolean;
        adminId: number;
    }[]>;
    countUnread(req: Request): Promise<number>;
    markAsRead(id: number, req: Request): Promise<{
        id: number;
        createdAt: Date;
        message: string;
        type: import("@prisma/client").$Enums.NotificationType;
        isRead: boolean;
        adminId: number;
    }>;
    markAllAsRead(req: Request): Promise<{
        message: string;
    }>;
}
