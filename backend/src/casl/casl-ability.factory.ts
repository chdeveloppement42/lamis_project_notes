import { Injectable } from '@nestjs/common';
import { AbilityBuilder, createMongoAbility, MongoAbility, ExtractSubjectType } from '@casl/ability';
import { PrismaService } from '../prisma/prisma.service';
import { JwtPayload } from '../auth/strategies/jwt.strategy';

export type AppAbility = MongoAbility;

@Injectable()
export class CaslAbilityFactory {
  constructor(private prisma: PrismaService) {}

  async createForUser(userPayload: JwtPayload): Promise<AppAbility> {
    const { can, build } = new AbilityBuilder<AppAbility>(createMongoAbility);

    if (userPayload.userType === 'PROVIDER') {
      // Providers have standard rules (e.g., manage their own listings)
      // Usually you don't even need CASL for simple Provider ownership, but here it is for scale
      can('manage', 'ProviderListings');
    } else if (userPayload.userType === 'ADMIN') {
      // Admins load their permissions from DB
      const admin = await this.prisma.admin.findUnique({
        where: { id: userPayload.userId },
        include: { role: { include: { permissions: { include: { permission: true } } } } },
      });

      if (admin && admin.isSuperAdmin) {
        can('manage', 'all'); // SuperAdmin can do anything
      } else if (admin) {
        // Map string permissions from database to CASL abilities
        admin.role.permissions.forEach(p => {
          // Action usually is "manage:providers", CASL takes string action and string subject
          // We can split the string, e.g., action="manage", subject="providers"
          const parts = p.permission.action.split(':');
          if (parts.length === 2) {
            can(parts[0], parts[1]);
          } else {
            can(p.permission.action, 'all'); 
          }
        });
      }
    }

    return build({
      detectSubjectType: item => item.constructor as ExtractSubjectType<any>,
    });
  }
}
