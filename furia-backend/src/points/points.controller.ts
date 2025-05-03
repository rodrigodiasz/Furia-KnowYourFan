import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { PointsService } from './points.service';
import { JwtAuthGuard } from '../users/jwt-auth.guard';

@Controller('points')
export class PointsController {
  constructor(private readonly pointsService: PointsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getUserPoints(@Req() req: Request) {
    const userId = (req as any).user.userId;
    return this.pointsService.getUserPoints(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('add')
  async addPoints(
    @Req() req: Request,
    @Body() body: { points: number; action: string },
  ) {
    const userId = (req as any).user.userId;
    return this.pointsService.addPoints(userId, body.points, body.action);
  }

  @UseGuards(JwtAuthGuard)
  @Post('redeem')
  async redeemPoints(
    @Req() req: Request,
    @Body() body: { rewardId: string; points: number },
  ) {
    const userId = (req as any).user.userId;
    return this.pointsService.redeemPoints(userId, body.rewardId, body.points);
  }
}
