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
exports.ProvidersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = __importStar(require("bcrypt"));
let ProvidersService = class ProvidersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(status) {
        return this.prisma.provider.findMany({
            where: status ? { status } : undefined,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
                address: true,
                documentUrl: true,
                status: true,
                createdAt: true,
                _count: { select: { listings: true } },
            },
        });
    }
    async findOne(id) {
        const provider = await this.prisma.provider.findUnique({
            where: { id },
            include: {
                listings: {
                    select: { id: true, title: true, status: true, createdAt: true },
                    orderBy: { createdAt: 'desc' },
                },
            },
        });
        if (!provider)
            throw new common_1.NotFoundException('Fournisseur introuvable.');
        const { password, ...result } = provider;
        return result;
    }
    async validate(id) {
        const provider = await this.findOne(id);
        if (provider.status !== 'PENDING') {
            throw new common_1.BadRequestException('Seuls les comptes en attente peuvent être validés.');
        }
        return this.prisma.provider.update({
            where: { id },
            data: { status: 'VALIDATED' },
        });
    }
    async reject(id) {
        const provider = await this.findOne(id);
        if (provider.status !== 'PENDING') {
            throw new common_1.BadRequestException('Seuls les comptes en attente peuvent être rejetés.');
        }
        return this.prisma.provider.update({
            where: { id },
            data: { status: 'REJECTED' },
        });
    }
    async suspend(id) {
        const provider = await this.findOne(id);
        if (provider.status === 'SUSPENDED') {
            throw new common_1.BadRequestException('Ce compte est déjà suspendu.');
        }
        return this.prisma.provider.update({
            where: { id },
            data: { status: 'SUSPENDED' },
        });
    }
    async reactivate(id) {
        const provider = await this.findOne(id);
        if (provider.status !== 'SUSPENDED') {
            throw new common_1.BadRequestException('Seuls les comptes suspendus peuvent être réactivés.');
        }
        return this.prisma.provider.update({
            where: { id },
            data: { status: 'VALIDATED' },
        });
    }
    async getOwnProfile(id) {
        const provider = await this.prisma.provider.findUnique({
            where: { id },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
                address: true,
                documentUrl: true,
                status: true,
                createdAt: true,
                _count: { select: { listings: true } },
            },
        });
        if (!provider)
            throw new common_1.NotFoundException('Fournisseur introuvable.');
        return provider;
    }
    async updateProfile(id, data) {
        await this.getOwnProfile(id);
        return this.prisma.provider.update({
            where: { id },
            data,
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
                address: true,
                status: true,
            },
        });
    }
    async updateSensitiveFields(id, data) {
        await this.getOwnProfile(id);
        return this.prisma.provider.update({
            where: { id },
            data: { ...data, status: 'PENDING' },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                status: true,
            },
        });
    }
    async changeOwnPassword(id, currentPassword, newPassword) {
        const provider = await this.prisma.provider.findUnique({ where: { id } });
        if (!provider)
            throw new common_1.NotFoundException('Fournisseur introuvable.');
        const isMatch = await bcrypt.compare(currentPassword, provider.password);
        if (!isMatch)
            throw new common_1.BadRequestException('Mot de passe actuel incorrect.');
        if (newPassword.length < 4) {
            throw new common_1.BadRequestException('Le nouveau mot de passe doit contenir au moins 4 caractères.');
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await this.prisma.provider.update({
            where: { id },
            data: { password: hashedPassword },
        });
        return { message: 'Mot de passe modifié avec succès.' };
    }
};
exports.ProvidersService = ProvidersService;
exports.ProvidersService = ProvidersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProvidersService);
//# sourceMappingURL=providers.service.js.map