import { RolesService } from './roles.service';
export declare class RolesController {
    private readonly rolesService;
    constructor(rolesService: RolesService);
    findAll(): Promise<({
        _count: {
            admins: number;
        };
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
    } & {
        id: number;
        createdAt: Date;
        name: string;
        isDefault: boolean;
        isSuperAdmin: boolean;
        updatedAt: Date;
    })[]>;
    findAllPermissions(): Promise<{
        id: number;
        action: string;
        description: string | null;
        createdAt: Date;
    }[]>;
    findOne(id: number): Promise<{
        admins: {
            id: number;
            email: string;
            firstName: string;
            lastName: string;
            status: import("@prisma/client").$Enums.AccountStatus;
        }[];
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
    } & {
        id: number;
        createdAt: Date;
        name: string;
        isDefault: boolean;
        isSuperAdmin: boolean;
        updatedAt: Date;
    }>;
    create(body: {
        name: string;
        permissionIds: number[];
    }): Promise<{
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
    } & {
        id: number;
        createdAt: Date;
        name: string;
        isDefault: boolean;
        isSuperAdmin: boolean;
        updatedAt: Date;
    }>;
    update(id: number, body: {
        name?: string;
        permissionIds?: number[];
    }): Promise<{
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
    } & {
        id: number;
        createdAt: Date;
        name: string;
        isDefault: boolean;
        isSuperAdmin: boolean;
        updatedAt: Date;
    }>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
