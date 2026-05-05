import { ListingStatus } from '@prisma/client';
export declare class CreateListingDto {
    title: string;
    description: string;
    price: number;
    city: string;
    district: string;
    categoryId: number;
    status?: ListingStatus;
    images?: string[];
}
export declare class UpdateListingDto {
    title?: string;
    description?: string;
    price?: number;
    city?: string;
    district?: string;
    categoryId?: number;
    status?: ListingStatus;
}
