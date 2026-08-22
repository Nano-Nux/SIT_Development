import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { AdminsModule } from './admins/admins.module';
import { HeroModule } from './hero/hero.module';
import { CoreValuesModule } from './core-values/core-values.module';
import { MajorsModule } from './majors/majors.module';
import { DepartmentsModule } from './departments/departments.module';
import { ProgramsModule } from './programs/programs.module';
import { FacultyModule } from './faculty/faculty.module';
import { ProgramDirectorsModule } from './program-directors/program-directors.module';
import { SpotlightsModule } from './spotlights/spotlights.module';
import { PartnersModule } from './partners/partners.module';
import { CampusFacilitiesModule } from './campus-facilities/campus-facilities.module';
import { NewsModule } from './news/news.module';
import { EventsModule } from './events/events.module';
import { StudentLifeModule } from './student-life/student-life.module';
import { AboutModule } from './about/about.module';
import { ContactModule } from './contact/contact.module';
import { AdmissionsModule } from './admissions/admissions.module';
import { ApplicationsModule } from './applications/applications.module';
import { RequestInfoModule } from './request-info/request-info.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { UploadsModule } from './uploads/uploads.module';
import { EmailModule } from './email/email.module';
import { MetricsModule } from './metrics/metrics.module';
import { MetricsInterceptor } from './metrics/metrics.interceptor';

@Module({
  imports: [
    PrismaModule,
    EmailModule,
    AuthModule,
    AdminsModule,
    HeroModule,
    CoreValuesModule,
    MajorsModule,
    DepartmentsModule,
    ProgramsModule,
    FacultyModule,
    ProgramDirectorsModule,
    SpotlightsModule,
    PartnersModule,
    CampusFacilitiesModule,
    NewsModule,
    EventsModule,
    StudentLifeModule,
    AboutModule,
    ContactModule,
    AdmissionsModule,
    ApplicationsModule,
    RequestInfoModule,
    DashboardModule,
    UploadsModule,
    MetricsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: MetricsInterceptor,
    },
  ],
})
export class AppModule {}
