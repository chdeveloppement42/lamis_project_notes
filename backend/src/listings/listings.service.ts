import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ListingStatus, NotificationType, AccountStatus } from '@prisma/client';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class ListingsService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  // ─── HELPER: Common Safety Lock Filter ──────────────────────────
  private get safetyLockWhere(): any {
    return {
      status: ListingStatus.PUBLISHED,
      provider: {
        status: AccountStatus.VALIDATED,
      },
    };
  }

  // ─── PUBLIC: Browse published listings with filters ─────────────
  async findPublished(filters: {
    categoryId?: number;
    city?: string;
    minPrice?: number;
    maxPrice?: number;
    page?: number;
    limit?: number;
  }) {
    const { categoryId, city, minPrice, maxPrice, page = 1, limit = 12 } = filters;

    const where: any = { 
      AND: [this.safetyLockWhere]
    };
    
    if (categoryId) where.AND.push({ categoryId: parseInt(categoryId as any, 10) });
    if (city) where.AND.push({ city: { contains: city, mode: 'insensitive' } });
    if (minPrice || maxPrice) {
      const priceFilter: any = {};
      if (minPrice) priceFilter.gte = parseFloat(minPrice as any);
      if (maxPrice) priceFilter.lte = parseFloat(maxPrice as any);
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

  // ─── PUBLIC: Get a single published listing ─────────────────────
  async findOnePublished(id: number) {
    const listing = await this.prisma.listing.findUnique({
      where: { id },
      include: {
        category: true,
        provider: { select: { id: true, firstName: true, lastName: true, phone: true, status: true } },
        images: { orderBy: { isMain: 'desc' } },
      },
    });
    
    if (!listing || listing.status !== 'PUBLISHED' || listing.provider.status !== 'VALIDATED') {
      throw new NotFoundException('Annonce introuvable.');
    }
    return listing;
  }

  // ─── PUBLIC: Get latest 6 published listings (for landing page) ─
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

  // ─── PROVIDER: Create a listing ─────────────────────────────────
  async create(
    providerId: number,
    data: {
      title: string;
      description: string;
      price: number;
      city: string;
      district: string;
      categoryId: number;
      status?: ListingStatus;
      images?: string[];
    },
  ) {
    // Verify provider is VALIDATED
    const provider = await this.prisma.provider.findUnique({ where: { id: providerId } });
    if (!provider || provider.status !== 'VALIDATED') {
      throw new ForbiddenException('Votre compte doit être validé pour publier une annonce.');
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
      type: NotificationType.NEW_LISTING,
      message: `Nouvelle annonce : "${listing.title}" par ${provider.firstName} ${provider.lastName}`,
    });

    return listing;
  }

  // ─── PROVIDER: Get own listings ─────────────────────────────────
  async findByProvider(providerId: number) {
    return this.prisma.listing.findMany({
      where: { providerId },
      orderBy: { createdAt: 'desc' },
      include: {
        category: { select: { name: true } },
        images: { where: { isMain: true }, take: 1 },
      },
    });
  }

  // ─── PROVIDER: Update own listing ───────────────────────────────
  async update(
    id: number,
    providerId: number,
    data: {
      title?: string;
      description?: string;
      price?: number;
      city?: string;
      district?: string;
      categoryId?: number;
      status?: ListingStatus;
    },
  ) {
    const listing = await this.prisma.listing.findUnique({ 
      where: { id },
      include: { provider: { select: { status: true } } }
    });
    if (!listing) throw new NotFoundException('Annonce introuvable.');
    if (listing.providerId !== providerId) {
      throw new ForbiddenException('Vous ne pouvez modifier que vos propres annonces.');
    }

    // Block if provider is not VALIDATED (Suspended/Rejected)
    if (listing.provider.status !== 'VALIDATED') {
      throw new ForbiddenException('Votre compte est restreint. Vous ne pouvez pas modifier cette annonce.');
    }

    return this.prisma.listing.update({
      where: { id },
      data,
      include: { category: true, images: true },
    });
  }

  // ─── PROVIDER: Delete own listing ───────────────────────────────
  async removeByProvider(id: number, providerId: number) {
    const listing = await this.prisma.listing.findUnique({ 
      where: { id },
      include: { provider: { select: { status: true } } }
    });
    if (!listing) throw new NotFoundException('Annonce introuvable.');
    if (listing.providerId !== providerId) {
      throw new ForbiddenException('Vous ne pouvez supprimer que vos propres annonces.');
    }

    // Block if provider is not VALIDATED
    if (listing.provider.status !== 'VALIDATED') {
      throw new ForbiddenException('Votre compte est restreint. Vous ne pouvez pas supprimer cette annonce.');
    }

    // Delete images first, then listing
    await this.prisma.listingImage.deleteMany({ where: { listingId: id } });
    return this.prisma.listing.delete({ where: { id } });
  }

  // ─── ADMIN: List all listings (any status) ──────────────────────
  async findAllAdmin(status?: ListingStatus) {
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

  // ─── ADMIN: Publish a listing ───────────────────────────────────
  async publish(id: number) {
    const listing = await this.prisma.listing.findUnique({ where: { id } });
    if (!listing) throw new NotFoundException('Annonce introuvable.');
    return this.prisma.listing.update({ where: { id }, data: { status: 'PUBLISHED' } });
  }

  // ─── ADMIN: Unpublish a listing ─────────────────────────────────
  async unpublish(id: number) {
    const listing = await this.prisma.listing.findUnique({ where: { id } });
    if (!listing) throw new NotFoundException('Annonce introuvable.');
    return this.prisma.listing.update({ where: { id }, data: { status: 'UNPUBLISHED' } });
  }

  // ─── ADMIN: Delete any listing ──────────────────────────────────
  async removeByAdmin(id: number) {
    const listing = await this.prisma.listing.findUnique({ where: { id } });
    if (!listing) throw new NotFoundException('Annonce introuvable.');
    await this.prisma.listingImage.deleteMany({ where: { listingId: id } });
    return this.prisma.listing.delete({ where: { id } });
  }
}
