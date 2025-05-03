import { Injectable } from '@nestjs/common';
import { OpenAI } from 'openai';
import { PrismaService } from '../services/prisma.service';
import { PointsService } from '../points/points.service';

@Injectable()
export class EsportsService {
  private openai: OpenAI;

  constructor(
    private readonly prisma: PrismaService,
    private pointsService: PointsService,
  ) {
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  async validateProfile(
    platform: string,
    profileUrl: string,
    userId: string,
  ): Promise<{ isValid: boolean; message: string; profileUrl?: string }> {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are an expert in validating e-sports profiles. Analyze the provided profile URL and determine if it's a valid profile for the specified platform. Consider factors like:
            1. URL format and structure
            2. Profile content and activity
            3. Relevance to the platform
            4. Authenticity indicators
            
            Respond with a simple text message indicating if the profile is valid or not, and a brief explanation why.`,
          },
          {
            role: 'user',
            content: `Platform: ${platform}\nProfile URL: ${profileUrl}`,
          },
        ],
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response from OpenAI');
      }

      const isValid =
        content.toLowerCase().includes('valid') ||
        content.toLowerCase().includes('válido') ||
        (!content.toLowerCase().includes('invalid') &&
          !content.toLowerCase().includes('inválido'));

      if (isValid) {
        let updateData: any = {};

        switch (platform.toLowerCase()) {
          case 'leagueoflegends':
            updateData.lol = profileUrl;
            break;
          case 'rainbowsix':
            updateData.rainbowSix = profileUrl;
            break;
          case 'steam':
            updateData.steam = profileUrl;
            break;
          case 'valorant':
            updateData.valorant = profileUrl;
            break;
          case 'gamersclub':
            updateData.gamersclub = profileUrl;
            break;
          case 'cs2':
            updateData.cs2 = profileUrl;
            break;
          default:
            updateData[platform.toLowerCase()] = profileUrl;
        }

        console.log('Updating with data:', updateData);

        await this.prisma.user.update({
          where: { id: userId },
          data: updateData,
        });

        await this.pointsService.addPoints(
          userId,
          10,
          `ESPORTS_VALIDATION_${platform.toUpperCase()}`,
        );
      }

      return {
        isValid,
        message: content,
        profileUrl: isValid ? profileUrl : undefined,
      };
    } catch (error) {
      console.error('Error validating e-sports profile:', error);
      return {
        isValid: false,
        message: 'Error validating profile',
      };
    }
  }
}
