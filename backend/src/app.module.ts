import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CaslModule } from './casl/casl.module';
import { ProvidersModule } from './providers/providers.module';
import { ListingsModule } from './listings/listings.module';
import { CategoriesModule } from './categories/categories.module';
import { AdminModule } from './admin/admin.module';
import { RolesModule } from './roles/roles.module';
import { NotificationsModule } from './notifications/notifications.module';
import { StorageModule } from './storage/storage.module';
import { MediaModule } from './media/media.module';
import { ContactModule } from './contact/contact.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [AuthModule, CaslModule, ProvidersModule, ListingsModule, CategoriesModule, AdminModule, RolesModule, NotificationsModule, StorageModule, MediaModule, ContactModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
