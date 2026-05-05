import { PrismaService } from '../prisma/prisma.service';
import { AccountStatus } from '@prisma/client';
export declare class ProvidersService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(status?: AccountStatus): Promise<{
        id: number;
        createdAt: Date;
        _count: {
            listings: number;
        };
        email: string;
        firstName: string;
        lastName: string;
        status: import("@prisma/client").$Enums.AccountStatus;
        phone: string;
        address: string;
        documentUrl: string;
    }[]>;
    findOne(id: number): Promise<{
        listings: {
            id: number;
            createdAt: Date;
            status: import("@prisma/client").$Enums.ListingStatus;
            title: string;
        }[];
        id: number;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        firstName: string;
        lastName: string;
        status: import("@prisma/client").$Enums.AccountStatus;
        phone: string;
        address: string;
        documentUrl: string;
    }>;
    validate(id: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        firstName: string;
        lastName: string;
        password: string;
        status: import("@prisma/client").$Enums.AccountStatus;
        phone: string;
        address: string;
        documentUrl: string;
    }>;
    reject(id: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        firstName: string;
        lastName: string;
        password: string;
        status: import("@prisma/client").$Enums.AccountStatus;
        phone: string;
        address: string;
        documentUrl: string;
    }>;
    suspend(id: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        firstName: string;
        lastName: string;
        password: string;
        status: import("@prisma/client").$Enums.AccountStatus;
        phone: string;
        address: string;
        documentUrl: string;
    }>;
    reactivate(id: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        firstName: string;
        lastName: string;
        password: string;
        status: import("@prisma/client").$Enums.AccountStatus;
        phone: string;
        address: string;
        documentUrl: string;
    }>;
    getOwnProfile(id: number): Promise<{
        id: number;
        createdAt: Date;
        _count: {
            listings: number;
        };
        email: string;
        firstName: string;
        lastName: string;
        status: import("@prisma/client").$Enums.AccountStatus;
        phone: string;
        address: string;
        documentUrl: string;
    }>;
    updateProfile(id: number, data: {
        firstName?: string;
        lastName?: string;
        phone?: string;
        address?: string;
    }): Promise<{
        id: number;
        email: string;
        firstName: string;
        lastName: string;
        status: import("@prisma/client").$Enums.AccountStatus;
        phone: string;
        address: string;
    }>;
    updateSensitiveFields(id: number, data: {
        email?: string;
        documentUrl?: string;
    }): Promise<{
        id: number;
        email: string;
        firstName: string;
        lastName: string;
        status: import("@prisma/client").$Enums.AccountStatus;
    }>;
    changeOwnPassword(id: number, currentPassword: string, newPassword: string): Promise<{
        message: string;
    }>;
}
