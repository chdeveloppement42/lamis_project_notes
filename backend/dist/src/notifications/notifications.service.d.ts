import { PrismaService } from '../prisma/prisma.service';
import { NotificationType } from '@prisma/client';
export declare class NotificationsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: {
        type: NotificationType;
        message: string;
        adminId: number;
    }): Promise<{
        id: number;
        createdAt: Date;
        message: string;
        type: import("@prisma/client").$Enums.NotificationType;
        isRead: boolean;
        adminId: number;
    }>;
    broadcast(data: {
        type: NotificationType;
        message: string;
    }): Promise<import("@prisma/client").Prisma.BatchPayload>;
    findAllForAdmin(adminId: number): Promise<{
        id: number;
        createdAt: Date;
        message: string;
        type: import("@prisma/client").$Enums.NotificationType;
        isRead: boolean;
        adminId: number;
    }[]>;
    countUnread(adminId: number): Promise<number>;
    markAsRead(id: number, adminId: number): Promise<{
        id: number;
        createdAt: Date;
        message: string;
        type: import("@prisma/client").$Enums.NotificationType;
        isRead: boolean;
        adminId: number;
    }>;
    markAllAsRead(adminId: number): Promise<{
        message: string;
    }>;
}
