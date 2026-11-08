import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ContactsModule } from './contacts/contacts.module';
import { FleetModule } from './fleet/fleet.module';
import { NewsModule } from './news/news.module';
import { CompaniesModule } from './companies/companies.module';
import { TranslationsModule } from './translations/translations.module';
import { SettingsModule } from './settings/settings.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    ContactsModule,
    FleetModule,
    NewsModule,
    CompaniesModule,
    TranslationsModule,
    SettingsModule,
  ],
})
export class AppModule {}
