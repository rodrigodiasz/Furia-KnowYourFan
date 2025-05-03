import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SocialAccount } from './dto/social-account.dto';
import { TermsAcceptanceDto } from './dto/terms-acceptance.dto';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { PointsService } from '../points/points.service';
import axios from 'axios';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private pointsService: PointsService,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const { name, email, password } = createUserDto;

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('Email já está em uso');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const user = await this.prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      });

      const { password: _, ...result } = user;
      return result;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Erro ao criar usuário');
    }
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('E-mail ou senha incorretos');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('E-mail ou senha incorretos');
    }

    const secret = process.env.JWT_SECRET || 'default_secret';
    const token = jwt.sign({ userId: user.id, email: user.email }, secret, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });

    return {
      message: 'Login bem-sucedido',
      token,
    };
  }

  async updateUser(userId: string, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: updateUserDto,
    });

    const profileFields = ['address', 'cpf', 'interests', 'activities'];
    const hasProfileUpdate = profileFields.some(
      (field) => updateUserDto[field] !== undefined,
    );

    if (hasProfileUpdate) {
      await this.pointsService.addPoints(userId, 10, 'PROFILE_UPDATE');
    }

    return user;
  }

  async getUserById(userId: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          address: true,
          cpf: true,
          interests: true,
          activities: true,
          events: true,
          purchases: true,
          twitterId: true,
          instagramId: true,
          facebookId: true,
          twitchId: true,
          discordId: true,
          steam: true,
          valorant: true,
          gamersclub: true,
          lol: true,
          cs2: true,
          rainbowSix: true,
        },
      });

      if (!user) {
        throw new UnauthorizedException('Usuário não encontrado');
      }

      return user;
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      throw new InternalServerErrorException('Erro ao buscar usuário');
    }
  }

  async linkSocialAccount(userId: string, provider: string, socialId: string) {
    const updateData = {
      [`${provider.toLowerCase()}Id`]: socialId,
    };

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    await this.pointsService.addPoints(
      userId,
      10,
      `SOCIAL_LINK_${provider.toUpperCase()}`,
    );

    return user;
  }

  async getSocialAccounts(userId: string): Promise<SocialAccount[]> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        twitterId: true,
        instagramId: true,
        facebookId: true,
        twitchId: true,
        discordId: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const accounts: SocialAccount[] = [];
    if (user.twitterId)
      accounts.push({ provider: 'twitter', socialId: user.twitterId });
    if (user.instagramId)
      accounts.push({ provider: 'instagram', socialId: user.instagramId });
    if (user.facebookId)
      accounts.push({ provider: 'facebook', socialId: user.facebookId });
    if (user.twitchId)
      accounts.push({ provider: 'twitch', socialId: user.twitchId });
    if (user.discordId)
      accounts.push({ provider: 'discord', socialId: user.discordId });

    return accounts;
  }

  async unlinkSocialAccount(userId: string, provider: string) {
    const updateData = {
      [`${provider.toLowerCase()}Id`]: null,
    };

    return this.prisma.user.update({
      where: { id: userId },
      data: updateData,
    });
  }

  async getTermsAcceptance(userId: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { hasAcceptedTerms: true },
      });

      if (!user) {
        throw new NotFoundException('Usuário não encontrado');
      }

      return { hasAcceptedTerms: user.hasAcceptedTerms };
    } catch (error) {
      console.error('Erro ao verificar aceitação dos termos:', error);
      throw new InternalServerErrorException(
        'Erro ao verificar aceitação dos termos',
      );
    }
  }

  async updateTermsAcceptance(
    userId: string,
    termsAcceptanceDto: TermsAcceptanceDto,
  ) {
    try {
      const user = await this.prisma.user.update({
        where: { id: userId },
        data: { hasAcceptedTerms: termsAcceptanceDto.accepted },
        select: { hasAcceptedTerms: true },
      });

      return { hasAcceptedTerms: user.hasAcceptedTerms };
    } catch (error) {
      console.error('Erro ao atualizar aceitação dos termos:', error);
      throw new InternalServerErrorException(
        'Erro ao atualizar aceitação dos termos',
      );
    }
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    return this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
        hasAcceptedTerms: false,
      },
    });
  }

  async handleSocialAuth(provider: string, accessToken: string) {
    let userData;

    switch (provider) {
      case 'facebook':
        userData = await this.verifyFacebookToken(accessToken);
        break;
      case 'twitter':
        userData = await this.verifyTwitterToken(accessToken);
        break;
      case 'twitch':
        userData = await this.verifyTwitchToken(accessToken);
        break;
      case 'discord':
        userData = await this.verifyDiscordToken(accessToken);
        break;
      case 'instagram':
        userData = await this.verifyInstagramToken(accessToken);
        break;
      default:
        throw new Error('Unsupported provider');
    }

    let user = await this.findByEmail(userData.email);
    if (!user) {
      user = await this.create({
        email: userData.email,
        name: userData.name,
        password: Math.random().toString(36).slice(-8),
        hasAcceptedTerms: false,
      });
    }

    await this.linkSocialAccount(user.id, provider, userData.id);

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: process.env.JWT_EXPIRES_IN as string },
    );

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  private async verifyFacebookToken(accessToken: string) {
    const response = await axios.get(
      `https://graph.facebook.com/me?fields=id,name,email&access_token=${accessToken}`,
    );
    return {
      id: response.data.id,
      email: response.data.email,
      name: response.data.name,
    };
  }

  private async verifyTwitterToken(accessToken: string) {
    const response = await axios.get('https://api.twitter.com/2/users/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return {
      id: response.data.data.id,
      email: response.data.data.email,
      name: response.data.data.name,
    };
  }

  private async verifyTwitchToken(accessToken: string) {
    const response = await axios.get('https://api.twitch.tv/helix/users', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Client-Id': process.env.TWITCH_CLIENT_ID,
      },
    });

    if (!response.data.data || response.data.data.length === 0) {
      throw new UnauthorizedException('Token da Twitch inválido');
    }

    return {
      id: response.data.data[0].id,
      email: response.data.data[0].email,
      name: response.data.data[0].display_name,
    };
  }

  private async verifyDiscordToken(accessToken: string) {
    const response = await axios.get('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return {
      id: response.data.id,
      email: response.data.email,
      name: response.data.username,
    };
  }

  private async verifyInstagramToken(accessToken: string) {
    const response = await axios.get('https://graph.facebook.com/v18.0/me', {
      params: {
        fields: 'id,name,instagram_business_account',
        access_token: accessToken,
      },
    });

    if (!response.data.instagram_business_account) {
      throw new Error('No Instagram Business account found');
    }

    const instagramResponse = await axios.get(
      `https://graph.facebook.com/v18.0/${response.data.instagram_business_account.id}`,
      {
        params: {
          fields: 'id,username',
          access_token: accessToken,
        },
      },
    );

    return {
      id: instagramResponse.data.id,
      email: `${instagramResponse.data.username}@instagram.com`,
      name: instagramResponse.data.username,
    };
  }

  async verifyProviderToken(provider: string, accessToken: string) {
    switch (provider) {
      case 'twitch':
        return this.verifyTwitchToken(accessToken);
      case 'discord':
        return this.verifyDiscordToken(accessToken);
      case 'twitter':
        return this.verifyTwitterToken(accessToken);
      case 'instagram':
        return this.verifyInstagramToken(accessToken);
      case 'facebook':
        return this.verifyFacebookToken(accessToken);
      default:
        throw new Error('Provedor não suportado');
    }
  }

  async getTwitterToken(
    code: string,
    codeVerifier: string,
    redirectUri: string,
  ) {
    const clientId = process.env.TWITTER_CLIENT_ID;
    const clientSecret = process.env.TWITTER_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new Error('Twitter client credentials not configured');
    }

    const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString(
      'base64',
    );

    const response = await axios.post(
      'https://api.twitter.com/2/oauth2/token',
      new URLSearchParams({
        code,
        grant_type: 'authorization_code',
        client_id: clientId,
        redirect_uri: redirectUri,
        code_verifier: codeVerifier,
      } as Record<string, string>).toString(),
      {
        headers: {
          Authorization: `Basic ${basicAuth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );

    return response.data;
  }

  async getInstagramToken(code: string, redirectUri: string) {
    const clientId = process.env.INSTAGRAM_CLIENT_ID;
    const clientSecret = process.env.INSTAGRAM_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new Error('Instagram client credentials not configured');
    }

    const response = await axios.post(
      'https://graph.facebook.com/v18.0/oauth/access_token',
      new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
      } as Record<string, string>).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );

    return response.data;
  }
}
