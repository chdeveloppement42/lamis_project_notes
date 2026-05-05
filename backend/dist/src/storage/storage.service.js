"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var StorageService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const sharp_1 = __importDefault(require("sharp"));
const cloudinary_1 = require("cloudinary");
let StorageService = StorageService_1 = class StorageService {
    config;
    logger = new common_1.Logger(StorageService_1.name);
    uploadDir;
    provider;
    constructor(config) {
        this.config = config;
        this.uploadDir = this.config.get('UPLOAD_DIR', './uploads');
        this.provider = this.config.get('STORAGE_PROVIDER', 'disk');
    }
    onModuleInit() {
        if (this.provider === 'cloudinary') {
            cloudinary_1.v2.config({
                cloud_name: this.config.getOrThrow('CLOUDINARY_CLOUD_NAME'),
                api_key: this.config.getOrThrow('CLOUDINARY_API_KEY'),
                api_secret: this.config.getOrThrow('CLOUDINARY_API_SECRET'),
            });
        }
        else {
            if (!fs.existsSync(this.uploadDir)) {
                fs.mkdirSync(this.uploadDir, { recursive: true });
            }
        }
    }
    async saveWatermarked(fileBuffer, filename) {
        try {
            const { width: origWidth = 800 } = await (0, sharp_1.default)(fileBuffer).metadata();
            const finalWidth = Math.min(origWidth, 1920);
            const wmarkWidth = Math.round(finalWidth * 0.55);
            const wmarkHeight = Math.round(wmarkWidth * 0.2);
            const fontSize = Math.round(wmarkWidth * 0.12);
            const svgWatermark = `
        <svg width="${wmarkWidth}" height="${wmarkHeight}">
          <style>
            .text { fill: white; fill-opacity: 0.5; font-size: ${fontSize}px; font-family: sans-serif; font-weight: bold; }
          </style>
          <text x="50%" y="60%" text-anchor="middle" dominant-baseline="middle" class="text">IMMO LAMIS</text>
        </svg>
      `;
            const processed = await (0, sharp_1.default)(fileBuffer)
                .resize(1920, null, { withoutEnlargement: true })
                .webp({ quality: 80 })
                .composite([{ input: Buffer.from(svgWatermark), gravity: 'center' }])
                .toBuffer();
            const webpFilename = filename.replace(/\.[^/.]+$/, '') + '.webp';
            if (this.provider === 'cloudinary') {
                const publicId = `listings/${webpFilename.replace(/\.[^/.]+$/, '')}`;
                return this.uploadToCloudinary(processed, publicId);
            }
            return this.saveToDisk(processed, webpFilename);
        }
        catch (error) {
            this.logger.error(`saveWatermarked failed: ${error?.message}`, error?.stack);
            throw new common_1.InternalServerErrorException("Erreur lors du traitement de l'image");
        }
    }
    async saveFile(buffer, filename) {
        const docDir = path.join(this.uploadDir, 'documents');
        if (!fs.existsSync(docDir)) {
            fs.mkdirSync(docDir, { recursive: true });
        }
        const filePath = path.join(docDir, filename);
        try {
            await fs.promises.writeFile(filePath, buffer);
            const publicPath = this.uploadDir.startsWith('.') ? this.uploadDir.substring(1) : this.uploadDir;
            return `${publicPath}/documents/${filename}`;
        }
        catch {
            throw new common_1.InternalServerErrorException('Erreur lors de la sauvegarde du document');
        }
    }
    async deleteFile(filepath) {
        try {
            if (filepath.startsWith('https://res.cloudinary.com')) {
                await this.deleteFromCloudinary(filepath);
            }
            else {
                const filename = path.basename(filepath);
                const fullPath = path.join(this.uploadDir, filename);
                if (fs.existsSync(fullPath)) {
                    await fs.promises.unlink(fullPath);
                }
            }
        }
        catch { }
    }
    async saveToDisk(buffer, filename) {
        const filePath = path.join(this.uploadDir, filename);
        await fs.promises.writeFile(filePath, buffer);
        const publicPath = this.uploadDir.startsWith('.') ? this.uploadDir.substring(1) : this.uploadDir;
        return `${publicPath}/${filename}`;
    }
    uploadToCloudinary(buffer, publicId) {
        return new Promise((resolve, reject) => {
            const stream = cloudinary_1.v2.uploader.upload_stream({ public_id: publicId, resource_type: 'image', overwrite: true }, (error, result) => {
                if (error || !result)
                    return reject(error ?? new Error('Cloudinary upload failed'));
                resolve(result.secure_url);
            });
            stream.end(buffer);
        });
    }
    async deleteFromCloudinary(url) {
        const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[^.]+$/);
        if (match) {
            await cloudinary_1.v2.uploader.destroy(match[1]);
        }
    }
};
exports.StorageService = StorageService;
exports.StorageService = StorageService = StorageService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], StorageService);
//# sourceMappingURL=storage.service.js.map