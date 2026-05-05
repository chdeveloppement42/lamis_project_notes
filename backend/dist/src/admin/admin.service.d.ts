import { PrismaService } from '../prisma/prisma.service';
export declare class AdminService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        id: number;
        createdAt: Date;
        isSuperAdmin: boolean;
        updatedAt: Date;
        role: {
            id: number;
            name: string;
        };
        email: string;
        firstName: string;
        lastName: string;
        status: import("@prisma/client").$Enums.AccountStatus;
        roleId: number;
        createdById: number | null;
        createdBy: {
            id: number;
            firstName: string;
            lastName: string;
        } | null;
    }[]>;
    findOne(id: number): Promise<{
        id: number;
        createdAt: Date;
        isSuperAdmin: boolean;
        updatedAt: Date;
        role: {
            id: number;
            name: string;
            permissions: ({
                permission: {
                    id: number;
                    action: string;
                    description: string | null;
                    createdAt: Date;
                };
            } & {
                id: number;
                createdAt: Date;
                permissionId: number;
                roleId: number;
            })[];
        };
        email: string;
        firstName: string;
        lastName: string;
        status: import("@prisma/client").$Enums.AccountStatus;
        roleId: number;
        createdById: number | null;
        createdBy: {
            id: number;
            firstName: string;
            lastName: string;
        } | null;
    }>;
    create(creatorId: number, data: {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        roleId: number;
    }): Promise<{
        id: number;
        createdAt: Date;
        role: {
            id: number;
            name: string;
        };
        email: string;
        firstName: string;
        lastName: string;
        status: import("@prisma/client").$Enums.AccountStatus;
    }>;
    update(id: number, data: {
        firstName?: string;
        lastName?: string;
        roleId?: number;
    }): Promise<{
        id: number;
        role: {
            id: number;
            name: string;
        };
        email: string;
        firstName: string;
        lastName: string;
        status: import("@prisma/client").$Enums.AccountStatus;
    }>;
    suspend(id: number): Promise<{
        id: number;
        createdAt: Date;
        isSuperAdmin: boolean;
        updatedAt: Date;
        email: string;
        firstName: string;
        lastName: string;
        password: string;
        status: import("@prisma/client").$Enums.AccountStatus;
        roleId: number;
        createdById: number | null;
    }>;
    reactivate(id: number): Promise<{
        id: number;
        createdAt: Date;
        isSuperAdmin: boolean;
        updatedAt: Date;
        email: string;
        firstName: string;
        lastName: string;
        password: string;
        status: import("@prisma/client").$Enums.AccountStatus;
        roleId: number;
        createdById: number | null;
    }>;
    resetPassword(id: number, newPassword: string): Promise<{
        message: string;
    }>;
    changeOwnPassword(adminId: number, currentPassword: string, newPassword: string): Promise<{
        message: string;
    }>;
    getDashboardStats(): Promise<{
        pendingProviders: number;
        publishedListings: number;
        activeCategories: number;
        unreadNotifications: number;
    }>;
    delete(id: number): Promise<{
        message: string;
    }>;
}
