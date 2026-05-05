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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProvidersController = void 0;
const common_1 = require("@nestjs/common");
const providers_service_1 = require("./providers.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const permissions_guard_1 = require("../casl/permissions.guard");
const permissions_decorator_1 = require("../casl/permissions.decorator");
const client_1 = require("@prisma/client");
const provider_dto_1 = require("./dto/provider.dto");
let ProvidersController = class ProvidersController {
    providersService;
    constructor(providersService) {
        this.providersService = providersService;
    }
    getOwnProfile(req) {
        return this.providersService.getOwnProfile(req.user.userId);
    }
    updateProfile(req, updateProviderProfileDto) {
        return this.providersService.updateProfile(req.user.userId, updateProviderProfileDto);
    }
    updateSensitiveFields(req, updateSensitiveFieldsDto) {
        return this.providersService.updateSensitiveFields(req.user.userId, updateSensitiveFieldsDto);
    }
    changePassword(req, changePasswordDto) {
        return this.providersService.changeOwnPassword(req.user.userId, changePasswordDto.currentPassword, changePasswordDto.newPassword);
    }
    findAll(status) {
        return this.providersService.findAll(status);
    }
    findOne(id) {
        return this.providersService.findOne(id);
    }
    validate(id) {
        return this.providersService.validate(id);
    }
    reject(id) {
        return this.providersService.reject(id);
    }
    suspend(id) {
        return this.providersService.suspend(id);
    }
    reactivate(id) {
        return this.providersService.reactivate(id);
    }
};
exports.ProvidersController = ProvidersController;
__decorate([
    (0, common_1.Get)('profile'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ProvidersController.prototype, "getOwnProfile", null);
__decorate([
    (0, common_1.Patch)('profile'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, provider_dto_1.UpdateProviderProfileDto]),
    __metadata("design:returntype", void 0)
], ProvidersController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Patch)('profile/sensitive'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, provider_dto_1.UpdateSensitiveFieldsDto]),
    __metadata("design:returntype", void 0)
], ProvidersController.prototype, "updateSensitiveFields", null);
__decorate([
    (0, common_1.Patch)('profile/password'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, provider_dto_1.ChangePasswordDto]),
    __metadata("design:returntype", void 0)
], ProvidersController.prototype, "changePassword", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, permissions_decorator_1.CheckPermissions)({ action: 'manage', subject: 'providers' }),
    __param(0, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProvidersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, permissions_decorator_1.CheckPermissions)({ action: 'manage', subject: 'providers' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ProvidersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id/validate'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, permissions_decorator_1.CheckPermissions)({ action: 'manage', subject: 'providers' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ProvidersController.prototype, "validate", null);
__decorate([
    (0, common_1.Patch)(':id/reject'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, permissions_decorator_1.CheckPermissions)({ action: 'manage', subject: 'providers' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ProvidersController.prototype, "reject", null);
__decorate([
    (0, common_1.Patch)(':id/suspend'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, permissions_decorator_1.CheckPermissions)({ action: 'manage', subject: 'providers' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ProvidersController.prototype, "suspend", null);
__decorate([
    (0, common_1.Patch)(':id/reactivate'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, permissions_decorator_1.CheckPermissions)({ action: 'manage', subject: 'providers' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ProvidersController.prototype, "reactivate", null);
exports.ProvidersController = ProvidersController = __decorate([
    (0, common_1.Controller)('providers'),
    __metadata("design:paramtypes", [providers_service_1.ProvidersService])
], ProvidersController);
//# sourceMappingURL=providers.controller.js.map