import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import sharp from 'sharp';

@Injectable()
export class StorageService {
  private readonly uploadDir = process.env.UPLOAD_DIR || './uploads';

  constructor() {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  /**
   * Processes an image with Sharp:
   * 1. Resizes to max 1920px width
   * 2. Converts to WebP
   * 3. Applies a text watermark
   */
  async saveWatermarked(fileBuffer: Buffer, filename: string): Promise<string> {
    const webpFilename = filename.replace(/\.[^/.]+$/, '') + '.webp';
    const filePath = path.join(this.uploadDir, webpFilename);

    try {
      // ─── WATERMARK OVERLAY ───────────────────────────────────────
      // Create a semi-transparent SVG watermark
      const svgWatermark = `
        <svg width="500" height="100">
          <style>
            .text { fill: white; fill-opacity: 0.5; font-size: 60px; font-family: sans-serif; font-weight: bold; }
          </style>
          <text x="50%" y="50%" text-anchor="middle" class="text">IMMO LAMIS</text>
        </svg>
      `;

      // ─── SHARP PIPELINE ──────────────────────────────────────────
      await sharp(fileBuffer)
        .resize(1920, null, { withoutEnlargement: true }) // Max width 1920px
        .webp({ quality: 80 }) // Convert to WebP with good compression
        .composite([
          {
            input: Buffer.from(svgWatermark),
            gravity: 'center', // Center the watermark
          },
        ])
        .toFile(filePath);

      const publicPath = this.uploadDir.startsWith('.') ? this.uploadDir.substring(1) : this.uploadDir;
      return `${publicPath}/${webpFilename}`;
    } catch (error) {
      console.error('Failed to process/save image:', error);
      throw new InternalServerErrorException('Erreur lors du traitement de l\'image');
    }
  }

  async saveFile(buffer: Buffer, filename: string): Promise<string> {
    const docDir = path.join(this.uploadDir, 'documents');
    if (!fs.existsSync(docDir)) {
      fs.mkdirSync(docDir, { recursive: true });
    }
    
    const filePath = path.join(docDir, filename);
    try {
      await fs.promises.writeFile(filePath, buffer);
      const publicPath = this.uploadDir.startsWith('.') ? this.uploadDir.substring(1) : this.uploadDir;
      return `${publicPath}/documents/${filename}`;
    } catch (error) {
      throw new InternalServerErrorException('Erreur lors de la sauvegarde du document');
    }
  }

  async deleteFile(filepath: string): Promise<void> {
    try {
      const filename = path.basename(filepath);
      const fullPath = path.join(this.uploadDir, filename);
      if (fs.existsSync(fullPath)) {
        await fs.promises.unlink(fullPath);
      }
    } catch (error) {}
  }
}
