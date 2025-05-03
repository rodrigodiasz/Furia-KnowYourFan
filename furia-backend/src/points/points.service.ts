import { Injectable } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';

@Injectable()
export class PointsService {
  constructor(private prisma: PrismaService) {}

  async hasActionBeenPerformed(
    userId: string,
    action: string,
  ): Promise<boolean> {
    const existingAction = await this.prisma.pointHistory.findFirst({
      where: {
        userId,
        action,
      },
    });
    console.log(
      `Checking action ${action} for user ${userId}: ${!!existingAction}`,
    );
    return !!existingAction;
  }

  async addPoints(userId: string, points: number, action: string) {
    console.log(
      `Attempting to add ${points} points for action ${action} to user ${userId}`,
    );

    const hasAction = await this.hasActionBeenPerformed(userId, action);
    if (hasAction) {
      console.log(`Action ${action} already performed for user ${userId}`);
      return null;
    }

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        points: {
          increment: points,
        },
      },
    });

    await this.prisma.pointHistory.create({
      data: {
        userId,
        points,
        action,
      },
    });

    console.log(
      `Successfully added ${points} points for action ${action} to user ${userId}`,
    );
    return user;
  }

  async getUserPoints(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        pointsHistory: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    const totalPoints = user?.pointsHistory.reduce(
      (sum, history) => sum + history.points,
      0,
    );

    return {
      points: totalPoints ?? 0,
      pointsHistory: user?.pointsHistory ?? [],
    };
  }

  async redeemPoints(userId: string, rewardId: string, points: number) {
    const userPoints = await this.getUserPoints(userId);

    if (userPoints.points < points) {
      throw new Error('Pontos insuficientes para resgate');
    }

    const redemption = await this.prisma.pointHistory.create({
      data: {
        userId,
        points: -points,
        action: `REDEMPTION_${rewardId}`,
      },
    });

    return redemption;
  }
}
