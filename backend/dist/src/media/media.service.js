"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaService = void 0;
const common_1 = require("@nestjs/common");
const storage_service_1 = require("../storage/storage.service");
const uuid_1 = require("uuid");
let MediaService = class MediaService {
    storageService;
    constructor(storageService) {
        this.storageService = storageService;
    }
    async uploadListingImages(files) {
        if (!files || files.length === 0)
            return [];
        const uploadPromises = files.map(async (file) => {
            const filename = `${(0, uuid_1.v4)()}`;
            const fileUrl = await this.storageService.saveWatermarked(file.buffer, filename);
            return fileUrl;
        });
        return Promise.all(uploadPromises);
    }
};
exports.MediaService = MediaService;
exports.MediaService = MediaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [storage_service_1.StorageService])
], MediaService);
//# sourceMappingURL=media.service.js.map