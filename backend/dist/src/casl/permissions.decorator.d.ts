export type PermissionRule = {
    action: string;
    subject: string;
};
export declare const PERMISSIONS_KEY = "permissions_required";
export declare const CheckPermissions: (...requirements: PermissionRule[]) => import("@nestjs/common").CustomDecorator<string>;
