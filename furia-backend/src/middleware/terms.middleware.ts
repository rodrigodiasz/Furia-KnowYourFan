import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { PrismaService } from '../services/prisma.service';

@Injectable()
export class TermsMiddleware implements NestMiddleware {
  constructor(private prisma: PrismaService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    if (req.path.includes('/users/terms')) {
      return next();
    }

    const userId = (req as any).user?.userId;
    if (!userId) {
      return next();
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { hasAcceptedTerms: true },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (!user.hasAcceptedTerms) {
      throw new UnauthorizedException('Terms of service must be accepted');
    }

    next();
  }
}
