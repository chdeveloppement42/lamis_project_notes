"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListingsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const notifications_service_1 = require("../notifications/notifications.service");
let ListingsService = class ListingsService {
    prisma;
    notificationsService;
    constructor(prisma, notificationsService) {
        this.prisma = prisma;
        this.notificationsService = notificationsService;
    }
    get safetyLockWhere() {
        return {
            status: client_1.ListingStatus.PUBLISHED,
            provider: {
                status: client_1.AccountStatus.VALIDATED,
            },
        };
    }
    async findPublished(filters) {
        const { categoryId, city, minPrice, maxPrice, page = 1, limit = 12 } = filters;
        const where = {
            AND: [this.safetyLockWhere]
        };
        if (categoryId)
            where.AND.push({ categoryId: parseInt(categoryId, 10) });
        if (city)
            where.AND.push({ city: { contains: city, mode: 'insensitive' } });
        if (minPrice || maxPrice) {
            const priceFilter = {};
            if (minPrice)
                priceFilter.gte = parseFloat(minPrice);
            if (maxPrice)
                priceFilter.lte = parseFloat(maxPrice);
            where.AND.push({ price: priceFilter });
        }
        const [listings, total] = await Promise.all([
            this.prisma.listing.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    category: { select: { name: true, slug: true } },
                    provider: { select: { firstName: true, lastName: true } },
                    images: { where: { isMain: true }, take: 1 },
                },
            }),
            this.prisma.listing.count({ where }),
        ]);
        return {
            data: listings,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findOnePublished(id) {
        const listing = await this.prisma.listing.findUnique({
            where: { id },
            include: {
                category: true,
                provider: { select: { id: true, firstName: true, lastName: true, phone: true, status: true } },
                images: { orderBy: { isMain: 'desc' } },
            },
        });
        if (!listing || listing.status !== 'PUBLISHED' || listing.provider.status !== 'VALIDATED') {
            throw new common_1.NotFoundException('Annonce introuvable.');
        }
        return listing;
    }
    async findLatest() {
        return this.prisma.listing.findMany({
            where: this.safetyLockWhere,
            take: 6,
            orderBy: { createdAt: 'desc' },
            include: {
                category: { select: { name: true, slug: true } },
                images: { where: { isMain: true }, take: 1 },
            },
        });
    }
    async create(providerId, data) {
        const provider = await this.prisma.provider.findUnique({ where: { id: providerId } });
        if (!provider || provider.status !== 'VALIDATED') {
            throw new common_1.ForbiddenException('Votre compte doit être validé pour publier une annonce.');
        }
        const listing = await this.prisma.listing.create({
            data: {
                title: data.title,
                description: data.description,
                price: data.price,
                city: data.city,
                district: data.district,
                status: data.status || 'DRAFT',
                provider: { connect: { id: providerId } },
                category: { connect: { id: data.categoryId } },
                images: {
                    create: data.images?.map((url, index) => ({
                        url,
                        isMain: index === 0,
                    })) || [],
                },
            },
            include: { category: true, images: true },
        });
        await this.notificationsService.broadcast({
            type: client_1.NotificationType.NEW_LISTING,
            message: `Nouvelle annonce : "${listing.title}" par ${provider.firstName} ${provider.lastName}`,
        });
        return listing;
    }
    async findByProvider(providerId) {
        return this.prisma.listing.findMany({
            where: { providerId },
            orderBy: { createdAt: 'desc' },
            include: {
                category: { select: { name: true } },
                images: { where: { isMain: true }, take: 1 },
            },
        });
    }
    async update(id, providerId, data) {
        const listing = await this.prisma.listing.findUnique({
            where: { id },
            include: { provider: { select: { status: true } } }
        });
        if (!listing)
            throw new common_1.NotFoundException('Annonce introuvable.');
        if (listing.providerId !== providerId) {
            throw new common_1.ForbiddenException('Vous ne pouvez modifier que vos propres annonces.');
        }
        if (listing.provider.status !== 'VALIDATED') {
            throw new common_1.ForbiddenException('Votre compte est restreint. Vous ne pouvez pas modifier cette annonce.');
        }
        return this.prisma.listing.update({
            where: { id },
            data,
            include: { category: true, images: true },
        });
    }
    async removeByProvider(id, providerId) {
        const listing = await this.prisma.listing.findUnique({
            where: { id },
            include: { provider: { select: { status: true } } }
        });
        if (!listing)
            throw new common_1.NotFoundException('Annonce introuvable.');
        if (listing.providerId !== providerId) {
            throw new common_1.ForbiddenException('Vous ne pouvez supprimer que vos propres annonces.');
        }
        if (listing.provider.status !== 'VALIDATED') {
            throw new common_1.ForbiddenException('Votre compte est restreint. Vous ne pouvez pas supprimer cette annonce.');
        }
        await this.prisma.listingImage.deleteMany({ where: { listingId: id } });
        return this.prisma.listing.delete({ where: { id } });
    }
    async findAllAdmin(status) {
        return this.prisma.listing.findMany({
            where: status ? { status } : undefined,
            orderBy: { createdAt: 'desc' },
            include: {
                category: { select: { name: true } },
                provider: { select: { id: true, firstName: true, lastName: true, email: true, status: true } },
                images: { where: { isMain: true }, take: 1 },
            },
        });
    }
    async publish(id) {
        const listing = await this.prisma.listing.findUnique({ where: { id } });
        if (!listing)
            throw new common_1.NotFoundException('Annonce introuvable.');
        return this.prisma.listing.update({ where: { id }, data: { status: 'PUBLISHED' } });
    }
    async unpublish(id) {
        const listing = await this.prisma.listing.findUnique({ where: { id } });
        if (!listing)
            throw new common_1.NotFoundException('Annonce introuvable.');
        return this.prisma.listing.update({ where: { id }, data: { status: 'UNPUBLISHED' } });
    }
    async removeByAdmin(id) {
        const listing = await this.prisma.listing.findUnique({ where: { id } });
        if (!listing)
            throw new common_1.NotFoundException('Annonce introuvable.');
        await this.prisma.listingImage.deleteMany({ where: { listingId: id } });
        return this.prisma.listing.delete({ where: { id } });
    }
};
exports.ListingsService = ListingsService;
exports.ListingsService = ListingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService])
], ListingsService);
//# sourceMappingURL=listings.service.js.map