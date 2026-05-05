import { MediaService } from './media.service';
export declare class MediaController {
    private readonly mediaService;
    constructor(mediaService: MediaService);
    uploadImages(files: Express.Multer.File[]): Promise<{
        message: string;
        urls: string[];
    }>;
}
