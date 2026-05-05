import { ListingsService } from './listings.service';
import { CreateListingDto, UpdateListingDto } from './dto/listing.dto';
import { ListingStatus } from '@prisma/client';
export declare class ListingsController {
    private readonly listingsService;
    constructor(listingsService: ListingsService);
    findPublished(categoryId?: string, city?: string, minPrice?: string, maxPrice?: string, page?: string, limit?: string): Promise<{
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
    findOne(id: number): Promise<{
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
    create(req: any, createListingDto: CreateListingDto): Promise<{
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
    findMine(req: any): Promise<({
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
    update(req: any, id: number, updateListingDto: UpdateListingDto): Promise<{
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
    remove(req: any, id: number): Promise<{
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
