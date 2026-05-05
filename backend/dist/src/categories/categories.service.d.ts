import { PrismaService } from '../prisma/prisma.service';
export declare class CategoriesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<({
        _count: {
            listings: number;
        };
    } & {
        id: number;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        slug: string;
    })[]>;
    findOne(id: number): Promise<{
        id: number;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        slug: string;
    }>;
    create(name: string): Promise<{
        id: number;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        slug: string;
    }>;
    update(id: number, name: string): Promise<{
        id: number;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        slug: string;
    }>;
    remove(id: number): Promise<{
        id: number;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        slug: string;
    }>;
}
