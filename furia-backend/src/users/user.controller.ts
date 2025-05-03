import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { TermsAcceptanceDto } from './dto/terms-acceptance.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.createUser(createUserDto);
    return user;
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return await this.userService.login(body.email, body.password);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Req() req: Request) {
    const user = (req as any).user;
    return await this.userService.getUserById(user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update')
  async updateUser(@Body() updateUserDto: UpdateUserDto, @Req() req: Request) {
    const user = (req as any).user;
    return await this.userService.updateUser(user.userId, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('link-social')
  async linkSocialAccount(
    @Req() req: Request,
    @Body() body: { provider: string; accessToken: string },
  ) {
    const user = (req as any).user;
    const userData = await this.userService.verifyProviderToken(
      body.provider,
      body.accessToken,
    );
    return await this.userService.linkSocialAccount(
      user.userId,
      body.provider,
      userData.id,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('social-accounts')
  async getSocialAccounts(@Req() req: Request) {
    const user = (req as any).user;
    return await this.userService.getSocialAccounts(user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('unlink-social')
  async unlinkSocialAccount(
    @Body() body: { provider: string },
    @Req() req: Request,
  ) {
    const user = (req as any).user;
    return await this.userService.unlinkSocialAccount(
      user.userId,
      body.provider,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('terms')
  async getTermsAcceptance(@Req() req: Request) {
    const user = (req as any).user;
    return await this.userService.getTermsAcceptance(user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('terms')
  async updateTermsAcceptance(
    @Req() req: Request,
    @Body() termsAcceptanceDto: TermsAcceptanceDto,
  ) {
    const user = (req as any).user;
    return await this.userService.updateTermsAcceptance(
      user.userId,
      termsAcceptanceDto,
    );
  }

  @Post('social-auth')
  async socialAuth(@Body() body: { provider: string; accessToken: string }) {
    return this.userService.handleSocialAuth(body.provider, body.accessToken);
  }

  @Post('auth/twitter/token')
  async getTwitterToken(
    @Body() body: { code: string; code_verifier: string; redirect_uri: string },
  ) {
    return this.userService.getTwitterToken(
      body.code,
      body.code_verifier,
      body.redirect_uri,
    );
  }

  @Post('auth/instagram/token')
  async getInstagramToken(
    @Body() body: { code: string; redirect_uri: string },
  ) {
    return this.userService.getInstagramToken(body.code, body.redirect_uri);
  }
}
