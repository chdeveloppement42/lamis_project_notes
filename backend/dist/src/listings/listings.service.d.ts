import { PrismaService } from '../prisma/prisma.service';
import { ListingStatus } from '@prisma/client';
import { NotificationsService } from '../notifications/notifications.service';
export declare class ListingsService {
    private prisma;
    private notificationsService;
    constructor(prisma: PrismaService, notificationsService: NotificationsService);
    private get safetyLockWhere();
    findPublished(filters: {
        categoryId?: number;
        city?: string;
        minPrice?: number;
        maxPrice?: number;
        page?: number;
        limit?: number;
    }): Promise<{
        data: ({
            category: {
                name: string;
                slug: string;
            };
            provider: {
                firstName: string;
                lastName: string;
            };
            images: {
                url: string;
                id: number;
                createdAt: Date;
                isMain: boolean;
                listingId: number;
            }[];
        } & {
            id: number;
            description: string;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.ListingStatus;
            title: string;
            price: number;
            city: string;
            district: string;
            providerId: number;
            categoryId: number;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOnePublished(id: number): Promise<{
        category: {
            id: number;
            createdAt: Date;
            name: string;
            updatedAt: Date;
            slug: string;
        };
        provider: {
            id: number;
            firstName: string;
            lastName: string;
            status: import("@prisma/client").$Enums.AccountStatus;
            phone: string;
        };
        images: {
            url: string;
            id: number;
            createdAt: Date;
            isMain: boolean;
            listingId: number;
        }[];
    } & {
        id: number;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.ListingStatus;
        title: string;
        price: number;
        city: string;
        district: string;
        providerId: number;
        categoryId: number;
    }>;
    findLatest(): Promise<({
        category: {
            name: string;
            slug: string;
        };
        images: {
            url: string;
            id: number;
            createdAt: Date;
            isMain: boolean;
            listingId: number;
        }[];
    } & {
        id: number;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.ListingStatus;
        title: string;
        price: number;
        city: string;
        district: string;
        providerId: number;
        categoryId: number;
    })[]>;
    create(providerId: number, data: {
        title: string;
        description: string;
        price: number;
        city: string;
        district: string;
        categoryId: number;
        status?: ListingStatus;
        images?: string[];
    }): Promise<{
        category: {
            id: number;
            createdAt: Date;
            name: string;
            updatedAt: Date;
            slug: string;
        };
        images: {
            url: string;
            id: number;
            createdAt: Date;
            isMain: boolean;
            listingId: number;
        }[];
    } & {
        id: number;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.ListingStatus;
        title: string;
        price: number;
        city: string;
        district: string;
        providerId: number;
        categoryId: number;
    }>;
    findByProvider(providerId: number): Promise<({
        category: {
            name: string;
        };
        images: {
            url: string;
            id: number;
            createdAt: Date;
            isMain: boolean;
            listingId: number;
        }[];
    } & {
        id: number;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.ListingStatus;
        title: string;
        price: number;
        city: string;
        district: string;
        providerId: number;
        categoryId: number;
    })[]>;
    update(id: number, providerId: number, data: {
        title?: string;
        description?: string;
        price?: number;
        city?: string;
        district?: string;
        categoryId?: number;
        status?: ListingStatus;
    }): Promise<{
        category: {
            id: number;
            createdAt: Date;
            name: string;
            updatedAt: Date;
            slug: string;
        };
        images: {
            url: string;
            id: number;
            createdAt: Date;
            isMain: boolean;
            listingId: number;
        }[];
    } & {
        id: number;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.ListingStatus;
        title: string;
        price: number;
        city: string;
        district: string;
        providerId: number;
        categoryId: number;
    }>;
    removeByProvider(id: number, providerId: number): Promise<{
        id: number;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.ListingStatus;
        title: string;
        price: number;
        city: string;
        district: string;
        providerId: number;
        categoryId: number;
    }>;
    findAllAdmin(status?: ListingStatus): Promise<({
        category: {
            name: string;
        };
        provider: {
            id: number;
            email: string;
            firstName: string;
            lastName: string;
            status: import("@prisma/client").$Enums.AccountStatus;
        };
        images: {
            url: string;
            id: number;
            createdAt: Date;
            isMain: boolean;
            listingId: number;
        }[];
    } & {
        id: number;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.ListingStatus;
        title: string;
        price: number;
        city: string;
        district: string;
        providerId: number;
        categoryId: number;
    })[]>;
    publish(id: number): Promise<{
        id: number;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.ListingStatus;
        title: string;
        price: number;
        city: string;
        district: string;
        providerId: number;
        categoryId: number;
    }>;
    unpublish(id: number): Promise<{
        id: number;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.ListingStatus;
        title: string;
        price: number;
        city: string;
        district: string;
        providerId: number;
        categoryId: number;
    }>;
    removeByAdmin(id: number): Promise<{
        id: number;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.ListingStatus;
        title: string;
        price: number;
        city: string;
        district: string;
        providerId: number;
        categoryId: number;
    }>;
}
