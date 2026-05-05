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
exports.PermissionsGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const casl_ability_factory_1 = require("./casl-ability.factory");
const permissions_decorator_1 = require("./permissions.decorator");
let PermissionsGuard = class PermissionsGuard {
    reflector;
    caslAbilityFactory;
    constructor(reflector, caslAbilityFactory) {
        this.reflector = reflector;
        this.caslAbilityFactory = caslAbilityFactory;
    }
    async canActivate(context) {
        const requiredPermissions = this.reflector.get(permissions_decorator_1.PERMISSIONS_KEY, context.getHandler());
        if (!requiredPermissions) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user) {
            throw new common_1.ForbiddenException('Utilisateur non authentifié.');
        }
        const ability = await this.caslAbilityFactory.createForUser(user);
        const hasPermission = requiredPermissions.every((rule) => ability.can(rule.action, rule.subject));
        if (!hasPermission) {
            throw new common_1.ForbiddenException('Vous ne disposez pas des permissions requises pour cette action.');
        }
        return true;
    }
};
exports.PermissionsGuard = PermissionsGuard;
exports.PermissionsGuard = PermissionsGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector,
        casl_ability_factory_1.CaslAbilityFactory])
], PermissionsGuard);
//# sourceMappingURL=permissions.guard.js.map