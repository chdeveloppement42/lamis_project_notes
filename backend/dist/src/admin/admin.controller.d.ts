import type { Request } from 'express';
import { AdminService } from './admin.service';
import { CreateAdminDto, UpdateAdminDto, ResetPasswordDto, ChangePasswordDto } from './dto/admin.dto';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    getDashboardStats(): Promise<{
        pendingProviders: number;
        publishedListings: number;
        activeCategories: number;
        unreadNotifications: number;
    }>;
    changeOwnPassword(req: Request, changePasswordDto: ChangePasswordDto): Promise<{
        message: string;
    }>;
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
    create(req: Request, createAdminDto: CreateAdminDto): Promise<{
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
    update(id: number, updateAdminDto: UpdateAdminDto): Promise<{
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
    resetPassword(id: number, resetPasswordDto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
