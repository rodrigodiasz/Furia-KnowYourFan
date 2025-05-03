import { Module } from '@nestjs/common';
import { EsportsController } from './esports.controller';
import { EsportsService } from './esports.service';
import { PrismaModule } from '../services/prisma.module';
import { PointsModule } from '../points/points.module';

@Module({
  imports: [PrismaModule, PointsModule],
  controllers: [EsportsController],
  providers: [EsportsService],
  exports: [EsportsService],
})
export class EsportsModule {}
