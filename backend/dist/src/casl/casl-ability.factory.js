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
exports.CaslAbilityFactory = void 0;
const common_1 = require("@nestjs/common");
const ability_1 = require("@casl/ability");
const prisma_service_1 = require("../prisma/prisma.service");
let CaslAbilityFactory = class CaslAbilityFactory {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createForUser(userPayload) {
        const { can, build } = new ability_1.AbilityBuilder(ability_1.createMongoAbility);
        if (userPayload.userType === 'PROVIDER') {
            can('manage', 'ProviderListings');
        }
        else if (userPayload.userType === 'ADMIN') {
            const admin = await this.prisma.admin.findUnique({
                where: { id: userPayload.userId },
                include: { role: { include: { permissions: { include: { permission: true } } } } },
            });
            if (admin && admin.isSuperAdmin) {
                can('manage', 'all');
            }
            else if (admin) {
                admin.role.permissions.forEach(p => {
                    const parts = p.permission.action.split(':');
                    if (parts.length === 2) {
                        can(parts[0], parts[1]);
                    }
                    else {
                        can(p.permission.action, 'all');
                    }
                });
            }
        }
        return build({
            detectSubjectType: item => item.constructor,
        });
    }
};
exports.CaslAbilityFactory = CaslAbilityFactory;
exports.CaslAbilityFactory = CaslAbilityFactory = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CaslAbilityFactory);
//# sourceMappingURL=casl-ability.factory.js.map