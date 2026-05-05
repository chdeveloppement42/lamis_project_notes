import { StorageService } from '../storage/storage.service';
export declare class MediaService {
    private readonly storageService;
    constructor(storageService: StorageService);
    uploadListingImages(files: Express.Multer.File[]): Promise<string[]>;
}
