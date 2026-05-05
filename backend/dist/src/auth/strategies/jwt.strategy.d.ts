import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
export interface JwtPayload {
    userId: number;
    email: string;
    userType: 'ADMIN' | 'PROVIDER';
    status?: string;
    roleId?: number;
}
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    constructor(config: ConfigService);
    validate(payload: JwtPayload): Promise<{
        userId: number;
        email: string;
        userType: "ADMIN" | "PROVIDER";
        status: string | undefined;
        roleId: number | undefined;
    }>;
}
export {};
