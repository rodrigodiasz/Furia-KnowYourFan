import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { EsportsService } from './esports.service';
import { JwtAuthGuard } from '../users/jwt-auth.guard';

@Controller('esports')
export class EsportsController {
  constructor(private readonly esportsService: EsportsService) {}

  @Post('validate-profile')
  @UseGuards(JwtAuthGuard)
  async validateProfile(
    @Request() req,
    @Body() body: { platform: string; profileUrl: string },
  ) {
    const validationResult = await this.esportsService.validateProfile(
      body.platform,
      body.profileUrl,
      req.user.userId,
    );
    return validationResult;
  }
}
