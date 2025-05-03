import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from 'src/services/prisma.module';
import { UserModule } from 'src/users/user.module';
import { DocumentModule } from 'src/document/document.module';
import { EsportsModule } from '../esports/esports.module';
import { PrismaService } from '../services/prisma.service';
import { AuthModule } from '../users/auth.module';
import { EsportsController } from 'src/esports/esports.controller';
import { EsportsService } from 'src/esports/esports.service';
import { PointsModule } from 'src/points/points.module';
import { PointsController } from 'src/points/points.controller';
import { PointsService } from 'src/points/points.service';


@Module({
  imports: [
    PrismaModule,
    UserModule,
    DocumentModule,
    EsportsModule,
    AuthModule,
    PointsModule,
  ],
  controllers: [AppController, EsportsController, PointsController],
  providers: [AppService, PrismaService, EsportsService, PointsService],
})
export class AppModule {}
