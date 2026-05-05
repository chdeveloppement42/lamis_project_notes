"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = __importStar(require("bcrypt"));
let AdminService = class AdminService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        return this.prisma.admin.findMany({
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                isSuperAdmin: true,
                status: true,
                roleId: true,
                createdById: true,
                createdAt: true,
                updatedAt: true,
                role: { select: { id: true, name: true } },
                createdBy: { select: { id: true, firstName: true, lastName: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id) {
        const admin = await this.prisma.admin.findUnique({
            where: { id },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                isSuperAdmin: true,
                status: true,
                roleId: true,
                createdById: true,
                createdAt: true,
                updatedAt: true,
                role: { select: { id: true, name: true, permissions: { include: { permission: true } } } },
                createdBy: { select: { id: true, firstName: true, lastName: true } },
            },
        });
        if (!admin)
            throw new common_1.NotFoundException('Admin introuvable');
        return admin;
    }
    async create(creatorId, data) {
        const existing = await this.prisma.admin.findUnique({ where: { email: data.email } });
        if (existing)
            throw new common_1.BadRequestException('Cet email est déjà utilisé');
        const role = await this.prisma.role.findUnique({
            where: { id: data.roleId },
            include: { permissions: { include: { permission: true } } },
        });
        if (!role)
            throw new common_1.NotFoundException('Rôle introuvable');
        if (role.isSuperAdmin)
            throw new common_1.ForbiddenException('Impossible d\'assigner le rôle Super Admin');
        const creator = await this.prisma.admin.findUnique({
            where: { id: creatorId },
            include: { role: { include: { permissions: { include: { permission: true } } } } },
        });
        if (creator && !creator.isSuperAdmin) {
            const creatorPermissions = creator.role?.permissions.map((rp) => rp.permission.action) || [];
            const targetPermissions = role.permissions.map((rp) => rp.permission.action);
            const escalated = targetPermissions.filter((p) => !creatorPermissions.includes(p));
            if (escalated.length > 0) {
                throw new common_1.ForbiddenException(`Escalation interdite : vous ne possédez pas les permissions [${escalated.join(', ')}]`);
            }
        }
        const hashedPassword = await bcrypt.hash(data.password, 10);
        return this.prisma.admin.create({
            data: {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                password: hashedPassword,
                roleId: data.roleId,
                createdById: creatorId,
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                status: true,
                role: { select: { id: true, name: true } },
                createdAt: true,
            },
        });
    }
    async update(id, data) {
        const admin = await this.prisma.admin.findUnique({ where: { id } });
        if (!admin)
            throw new common_1.NotFoundException('Admin introuvable');
        if (admin.isSuperAdmin)
            throw new common_1.ForbiddenException('Le Super Admin ne peut pas être modifié');
        if (data.roleId) {
            const role = await this.prisma.role.findUnique({ where: { id: data.roleId } });
            if (!role)
                throw new common_1.NotFoundException('Rôle introuvable');
            if (role.isSuperAdmin)
                throw new common_1.ForbiddenException('Impossible d\'assigner le rôle Super Admin');
        }
        return this.prisma.admin.update({
            where: { id },
            data,
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                status: true,
                role: { select: { id: true, name: true } },
            },
        });
    }
    async suspend(id) {
        const admin = await this.prisma.admin.findUnique({ where: { id } });
        if (!admin)
            throw new common_1.NotFoundException('Admin introuvable');
        if (admin.isSuperAdmin)
            throw new common_1.ForbiddenException('Le Super Admin ne peut pas être suspendu');
        return this.prisma.admin.update({
            where: { id },
            data: { status: 'SUSPENDED' },
        });
    }
    async reactivate(id) {
        const admin = await this.prisma.admin.findUnique({ where: { id } });
        if (!admin)
            throw new common_1.NotFoundException('Admin introuvable');
        return this.prisma.admin.update({
            where: { id },
            data: { status: 'VALIDATED' },
        });
    }
    async resetPassword(id, newPassword) {
        const admin = await this.prisma.admin.findUnique({ where: { id } });
        if (!admin)
            throw new common_1.NotFoundException('Admin introuvable');
        if (admin.isSuperAdmin)
            throw new common_1.ForbiddenException('Utilisez un autre mécanisme pour le Super Admin');
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await this.prisma.admin.update({
            where: { id },
            data: { password: hashedPassword },
        });
        return { message: 'Mot de passe réinitialisé avec succès' };
    }
    async changeOwnPassword(adminId, currentPassword, newPassword) {
        const admin = await this.prisma.admin.findUnique({ where: { id: adminId } });
        if (!admin)
            throw new common_1.NotFoundException('Admin introuvable');
        const isMatch = await bcrypt.compare(currentPassword, admin.password);
        if (!isMatch)
            throw new common_1.BadRequestException('Mot de passe actuel incorrect');
        if (newPassword.length < 4) {
            throw new common_1.BadRequestException('Le nouveau mot de passe doit contenir au moins 4 caractères');
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await this.prisma.admin.update({
            where: { id: adminId },
            data: { password: hashedPassword },
        });
        return { message: 'Mot de passe modifié avec succès' };
    }
    async getDashboardStats() {
        const [pendingProviders, publishedListings, activeCategories, unreadNotifications] = await Promise.all([
            this.prisma.provider.count({ where: { status: 'PENDING' } }),
            this.prisma.listing.count({ where: { status: 'PUBLISHED' } }),
            this.prisma.category.count(),
            this.prisma.notification.count({ where: { isRead: false } }),
        ]);
        return { pendingProviders, publishedListings, activeCategories, unreadNotifications };
    }
    async delete(id) {
        const admin = await this.prisma.admin.findUnique({ where: { id } });
        if (!admin)
            throw new common_1.NotFoundException('Admin introuvable');
        if (admin.isSuperAdmin)
            throw new common_1.ForbiddenException('Le Super Admin ne peut pas être supprimé');
        await this.prisma.admin.delete({ where: { id } });
        return { message: 'Compte administrateur supprimé avec succès' };
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminService);
//# sourceMappingURL=admin.service.js.map