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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const bcrypt = __importStar(require("bcrypt"));
const notifications_service_1 = require("../notifications/notifications.service");
const storage_service_1 = require("../storage/storage.service");
const uuid_1 = require("uuid");
const path = __importStar(require("path"));
const client_1 = require("@prisma/client");
let AuthService = class AuthService {
    prisma;
    jwtService;
    config;
    notificationsService;
    storageService;
    constructor(prisma, jwtService, config, notificationsService, storageService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.config = config;
        this.notificationsService = notificationsService;
        this.storageService = storageService;
    }
    async login(loginDto) {
        const { email, password } = loginDto;
        let user = await this.prisma.admin.findUnique({
            where: { email },
            include: { role: { include: { permissions: { include: { permission: true } } } } },
        });
        let userType = 'ADMIN';
        if (!user) {
            user = await this.prisma.provider.findUnique({ where: { email } });
            userType = 'PROVIDER';
        }
        if (!user)
            throw new common_1.UnauthorizedException('Identifiants invalides');
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid)
            throw new common_1.UnauthorizedException('Identifiants invalides');
        if (userType === 'ADMIN' && user.status === 'SUSPENDED') {
            throw new common_1.UnauthorizedException('Votre compte administrateur a été suspendu.');
        }
        const payload = {
            userId: user.id,
            email: user.email,
            userType,
            status: user.status,
            roleId: user.roleId,
        };
        const accessToken = this.jwtService.sign(payload);
        const refreshToken = this.signRefreshToken(payload);
        return {
            access_token: accessToken,
            refresh_token: refreshToken,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                userType,
                status: user.status,
                roleName: userType === 'ADMIN' ? user.role.name : null,
                isSuperAdmin: userType === 'ADMIN' ? user.isSuperAdmin : false,
                permissions: userType === 'ADMIN'
                    ? user.role.permissions.map((p) => p.permission.action)
                    : [],
            },
        };
    }
    async refresh(refreshToken) {
        try {
            const payload = this.jwtService.verify(refreshToken, {
                secret: this.config.getOrThrow('JWT_REFRESH_SECRET'),
            });
            const { userId, email, userType, status, roleId } = payload;
            const newPayload = { userId, email, userType, status, roleId };
            const newAccessToken = this.jwtService.sign(newPayload);
            const newRefreshToken = this.signRefreshToken(newPayload);
            return { access_token: newAccessToken, refresh_token: newRefreshToken };
        }
        catch {
            throw new common_1.UnauthorizedException('Session expirée. Veuillez vous reconnecter.');
        }
    }
    async register(registerDto, documentFile) {
        const { firstName, lastName, email, password, phone, address } = registerDto;
        const existingProvider = await this.prisma.provider.findUnique({ where: { email } });
        const existingAdmin = await this.prisma.admin.findUnique({ where: { email } });
        if (existingProvider || existingAdmin) {
            throw new common_1.BadRequestException('Cet email est déjà utilisé.');
        }
        let finalDocumentUrl = registerDto.documentUrl || '';
        if (documentFile) {
            const extension = path.extname(documentFile.originalname) || '.pdf';
            const filename = `${(0, uuid_1.v4)()}${extension}`;
            finalDocumentUrl = await this.storageService.saveFile(documentFile.buffer, filename);
        }
        else if (!finalDocumentUrl) {
            throw new common_1.BadRequestException('Un document justificatif est requis.');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const provider = await this.prisma.provider.create({
            data: {
                firstName,
                lastName,
                email,
                password: hashedPassword,
                phone,
                address,
                documentUrl: finalDocumentUrl,
                status: 'PENDING',
            },
        });
        await this.notificationsService.broadcast({
            type: client_1.NotificationType.NEW_PROVIDER,
            message: `Nouveau fournisseur inscrit : ${firstName} ${lastName} (${email})`,
        });
        return {
            message: 'Compte créé avec succès. En attente de validation par un administrateur.',
            providerId: provider.id,
        };
    }
    signRefreshToken(payload) {
        return this.jwtService.sign(payload, {
            secret: this.config.getOrThrow('JWT_REFRESH_SECRET'),
            expiresIn: this.config.get('JWT_REFRESH_EXPIRES_IN', '7d'),
        });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService,
        notifications_service_1.NotificationsService,
        storage_service_1.StorageService])
], AuthService);
//# sourceMappingURL=auth.service.js.map