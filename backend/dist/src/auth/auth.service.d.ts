import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { StorageService } from '../storage/storage.service';
export declare class AuthService {
    private prisma;
    private jwtService;
    private config;
    private notificationsService;
    private storageService;
    constructor(prisma: PrismaService, jwtService: JwtService, config: ConfigService, notificationsService: NotificationsService, storageService: StorageService);
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        refresh_token: string;
        user: {
            id: any;
            email: any;
            firstName: any;
            lastName: any;
            userType: "ADMIN" | "PROVIDER";
            status: any;
            roleName: any;
            isSuperAdmin: any;
            permissions: any;
        };
    }>;
    refresh(refreshToken: string): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    register(registerDto: RegisterDto, documentFile?: Express.Multer.File): Promise<{
        message: string;
        providerId: number;
    }>;
    private signRefreshToken;
}
