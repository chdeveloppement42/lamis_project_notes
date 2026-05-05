import { MongoAbility } from '@casl/ability';
import { PrismaService } from '../prisma/prisma.service';
import { JwtPayload } from '../auth/strategies/jwt.strategy';
export type AppAbility = MongoAbility;
export declare class CaslAbilityFactory {
    private prisma;
    constructor(prisma: PrismaService);
    createForUser(userPayload: JwtPayload): Promise<AppAbility>;
}
