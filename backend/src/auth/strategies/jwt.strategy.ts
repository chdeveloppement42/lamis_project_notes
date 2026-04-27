import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

export interface JwtPayload {
  userId: number;
  email: string;
  userType: 'ADMIN' | 'PROVIDER';
  status?: string; // Present for providers
  roleId?: number; // Present for admins
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'dev-secret-key-immolamis-123!',
    });
  }

  async validate(payload: JwtPayload) {
    // The extracted payload is attached to request.user
    return {
      userId: payload.userId,
      email: payload.email,
      userType: payload.userType,
      status: payload.status,
      roleId: payload.roleId,
    };
  }
}
