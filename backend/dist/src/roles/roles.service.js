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
exports.RolesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let RolesService = class RolesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        return this.prisma.role.findMany({
            include: {
                permissions: { include: { permission: true } },
                _count: { select: { admins: true } },
            },
            orderBy: { createdAt: 'asc' },
        });
    }
    async findOne(id) {
        const role = await this.prisma.role.findUnique({
            where: { id },
            include: {
                permissions: { include: { permission: true } },
                admins: {
                    select: { id: true, firstName: true, lastName: true, email: true, status: true },
                },
            },
        });
        if (!role)
            throw new common_1.NotFoundException('Rôle introuvable');
        return role;
    }
    async create(data) {
        const existing = await this.prisma.role.findUnique({ where: { name: data.name } });
        if (existing)
            throw new common_1.BadRequestException('Un rôle avec ce nom existe déjà');
        return this.prisma.role.create({
            data: {
                name: data.name,
                permissions: {
                    create: data.permissionIds.map((pid) => ({
                        permission: { connect: { id: pid } },
                    })),
                },
            },
            include: { permissions: { include: { permission: true } } },
        });
    }
    async update(id, data) {
        const role = await this.prisma.role.findUnique({ where: { id } });
        if (!role)
            throw new common_1.NotFoundException('Rôle introuvable');
        if (role.isSuperAdmin)
            throw new common_1.BadRequestException('Le rôle Super Admin ne peut pas être modifié');
        if (data.permissionIds) {
            await this.prisma.rolePermission.deleteMany({ where: { roleId: id } });
        }
        return this.prisma.role.update({
            where: { id },
            data: {
                ...(data.name && { name: data.name }),
                ...(data.permissionIds && {
                    permissions: {
                        create: data.permissionIds.map((pid) => ({
                            permission: { connect: { id: pid } },
                        })),
                    },
                }),
            },
            include: { permissions: { include: { permission: true } } },
        });
    }
    async remove(id) {
        const role = await this.prisma.role.findUnique({
            where: { id },
            include: { _count: { select: { admins: true } } },
        });
        if (!role)
            throw new common_1.NotFoundException('Rôle introuvable');
        if (role.isSuperAdmin)
            throw new common_1.BadRequestException('Le rôle Super Admin ne peut pas être supprimé');
        if (role.isDefault)
            throw new common_1.BadRequestException('Les rôles par défaut ne peuvent pas être supprimés');
        await this.prisma.admin.updateMany({
            where: { roleId: id },
            data: { status: 'SUSPENDED' },
        });
        await this.prisma.rolePermission.deleteMany({ where: { roleId: id } });
        const defaultRole = await this.prisma.role.findFirst({
            where: { isDefault: true, isSuperAdmin: false },
        });
        if (defaultRole) {
            await this.prisma.admin.updateMany({
                where: { roleId: id },
                data: { roleId: defaultRole.id },
            });
        }
        await this.prisma.role.delete({ where: { id } });
        return { message: `Rôle "${role.name}" supprimé. ${role._count.admins} utilisateur(s) suspendu(s).` };
    }
    async findAllPermissions() {
        return this.prisma.permission.findMany({ orderBy: { id: 'asc' } });
    }
};
exports.RolesService = RolesService;
exports.RolesService = RolesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RolesService);
//# sourceMappingURL=roles.service.js.map