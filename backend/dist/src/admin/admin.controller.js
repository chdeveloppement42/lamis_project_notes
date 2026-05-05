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
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const admin_service_1 = require("./admin.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const permissions_guard_1 = require("../casl/permissions.guard");
const permissions_decorator_1 = require("../casl/permissions.decorator");
const admin_dto_1 = require("./dto/admin.dto");
let AdminController = class AdminController {
    adminService;
    constructor(adminService) {
        this.adminService = adminService;
    }
    getDashboardStats() {
        return this.adminService.getDashboardStats();
    }
    changeOwnPassword(req, changePasswordDto) {
        return this.adminService.changeOwnPassword(req.user.userId, changePasswordDto.currentPassword, changePasswordDto.newPassword);
    }
    findAll() {
        return this.adminService.findAll();
    }
    findOne(id) {
        return this.adminService.findOne(id);
    }
    create(req, createAdminDto) {
        return this.adminService.create(req.user.userId, createAdminDto);
    }
    update(id, updateAdminDto) {
        return this.adminService.update(id, updateAdminDto);
    }
    suspend(id) {
        return this.adminService.suspend(id);
    }
    reactivate(id) {
        return this.adminService.reactivate(id);
    }
    resetPassword(id, resetPasswordDto) {
        return this.adminService.resetPassword(id, resetPasswordDto.newPassword);
    }
    remove(id) {
        return this.adminService.delete(id);
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Get)('dashboard-stats'),
    (0, permissions_decorator_1.CheckPermissions)({ action: 'view', subject: 'dashboard' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getDashboardStats", null);
__decorate([
    (0, common_1.Patch)('profile/password'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, admin_dto_1.ChangePasswordDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "changeOwnPassword", null);
__decorate([
    (0, common_1.Get)('users'),
    (0, permissions_decorator_1.CheckPermissions)({ action: 'manage', subject: 'admins' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('users/:id'),
    (0, permissions_decorator_1.CheckPermissions)({ action: 'manage', subject: 'admins' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)('users'),
    (0, permissions_decorator_1.CheckPermissions)({ action: 'manage', subject: 'admins' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, admin_dto_1.CreateAdminDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)('users/:id'),
    (0, permissions_decorator_1.CheckPermissions)({ action: 'manage', subject: 'admins' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, admin_dto_1.UpdateAdminDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)('users/:id/suspend'),
    (0, permissions_decorator_1.CheckPermissions)({ action: 'manage', subject: 'admins' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "suspend", null);
__decorate([
    (0, common_1.Patch)('users/:id/reactivate'),
    (0, permissions_decorator_1.CheckPermissions)({ action: 'manage', subject: 'admins' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "reactivate", null);
__decorate([
    (0, common_1.Patch)('users/:id/reset-password'),
    (0, permissions_decorator_1.CheckPermissions)({ action: 'manage', subject: 'admins' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, admin_dto_1.ResetPasswordDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.Delete)('users/:id'),
    (0, permissions_decorator_1.CheckPermissions)({ action: 'manage', subject: 'admins' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "remove", null);
exports.AdminController = AdminController = __decorate([
    (0, common_1.Controller)('admin'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    __metadata("design:paramtypes", [admin_service_1.AdminService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map