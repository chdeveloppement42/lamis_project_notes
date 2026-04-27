import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './strategies/jwt.strategy';
import { NotificationsService } from '../notifications/notifications.service';
import { StorageService } from '../storage/storage.service';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { NotificationType } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private notificationsService: NotificationsService,
    private storageService: StorageService,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // First check Admins
    let user: any = await this.prisma.admin.findUnique({
      where: { email },
      include: { role: { include: { permissions: { include: { permission: true } } } } },
    });
    let userType: 'ADMIN' | 'PROVIDER' = 'ADMIN';

    // If not Admin, check Providers
    if (!user) {
      user = await this.prisma.provider.findUnique({ where: { email } });
      userType = 'PROVIDER';
    }

    if (!user) {
      throw new UnauthorizedException('Identifiants invalides');
    }

    // Verify Password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Identifiants invalides');
    }

    // SUSPENDED admins cannot log in at all
    if (userType === 'ADMIN' && user.status === 'SUSPENDED') {
      throw new UnauthorizedException('Votre compte administrateur a été suspendu.');
    }

    // Generate JWT (providers with PENDING/REJECTED status CAN log in — frontend handles the UI state)
    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
      userType,
      status: user.status,
      roleId: user.roleId, // undefined if provider
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        userType,
        status: user.status,
        isSuperAdmin: userType === 'ADMIN' ? user.isSuperAdmin : false,
        permissions: userType === 'ADMIN' ? user.role.permissions.map((p: any) => p.permission.action) : [],
      },
    };
  }

  async register(registerDto: RegisterDto, documentFile?: Express.Multer.File) {
    const { firstName, lastName, email, password, phone, address } = registerDto;

    // Check if email already belongs to provider or admin
    const existingProvider = await this.prisma.provider.findUnique({ where: { email } });
    const existingAdmin = await this.prisma.admin.findUnique({ where: { email } });

    if (existingProvider || existingAdmin) {
      throw new BadRequestException('Cet email est déjà utilisé.');
    }

    let finalDocumentUrl = registerDto.documentUrl || '';

    // If file provided, save it
    if (documentFile) {
      const extension = path.extname(documentFile.originalname) || '.pdf';
      const filename = `${uuidv4()}${extension}`;
      finalDocumentUrl = await this.storageService.saveFile(documentFile.buffer, filename);
    } else if (!finalDocumentUrl) {
      throw new BadRequestException('Un document justificatif est requis.');
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

    // Broadcast notification to all admins
    await this.notificationsService.broadcast({
      type: NotificationType.NEW_PROVIDER,
      message: `Nouveau fournisseur inscrit : ${firstName} ${lastName} (${email})`,
    });

    return {
      message: 'Compte créé avec succès. En attente de validation par un administrateur.',
      providerId: provider.id,
    };
  }
}
