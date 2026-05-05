import { ConfigService } from '@nestjs/config';
import type { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthController {
    private readonly authService;
    private readonly config;
    constructor(authService: AuthService, config: ConfigService);
    login(loginDto: LoginDto, res: Response): Promise<{
        access_token: string;
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
    refresh(req: Request, res: Response): Promise<{
        access_token: string;
    }>;
    logout(res: Response): {
        message: string;
    };
    register(registerDto: RegisterDto, document?: Express.Multer.File): Promise<{
        message: string;
        providerId: number;
    }>;
    private setRefreshCookie;
}
