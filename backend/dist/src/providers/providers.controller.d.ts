import { ProvidersService } from './providers.service';
import { AccountStatus } from '@prisma/client';
import { UpdateProviderProfileDto, UpdateSensitiveFieldsDto, ChangePasswordDto } from './dto/provider.dto';
export declare class ProvidersController {
    private readonly providersService;
    constructor(providersService: ProvidersService);
    getOwnProfile(req: any): Promise<{
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
    updateProfile(req: any, updateProviderProfileDto: UpdateProviderProfileDto): Promise<{
        id: number;
        email: string;
        firstName: string;
        lastName: string;
        status: import("@prisma/client").$Enums.AccountStatus;
        phone: string;
        address: string;
    }>;
    updateSensitiveFields(req: any, updateSensitiveFieldsDto: UpdateSensitiveFieldsDto): Promise<{
        id: number;
        email: string;
        firstName: string;
        lastName: string;
        status: import("@prisma/client").$Enums.AccountStatus;
    }>;
    changePassword(req: any, changePasswordDto: ChangePasswordDto): Promise<{
        message: string;
    }>;
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
}
