export declare class CreateAdminDto {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    roleId: number;
}
export declare class UpdateAdminDto {
    firstName?: string;
    lastName?: string;
    roleId?: number;
}
export declare class ResetPasswordDto {
    newPassword: string;
}
export declare class ChangePasswordDto {
    currentPassword: string;
    newPassword: string;
}
