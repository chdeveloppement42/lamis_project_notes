import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
export declare class StorageService implements OnModuleInit {
    private config;
    private readonly logger;
    private readonly uploadDir;
    private readonly provider;
    constructor(config: ConfigService);
    onModuleInit(): void;
    saveWatermarked(fileBuffer: Buffer, filename: string): Promise<string>;
    saveFile(buffer: Buffer, filename: string): Promise<string>;
    deleteFile(filepath: string): Promise<void>;
    private saveToDisk;
    private uploadToCloudinary;
    private deleteFromCloudinary;
}
