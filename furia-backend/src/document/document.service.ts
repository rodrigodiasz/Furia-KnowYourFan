import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';
import { OpenAI } from 'openai';
import * as fs from 'fs';
import * as path from 'path';
import * as Tesseract from 'tesseract.js';
import * as pdfParse from 'pdf-parse';
import { join } from 'path';
import { PointsService } from '../points/points.service';

const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

@Injectable()
export class DocumentService {
  constructor(
    private readonly prisma: PrismaService,
    private pointsService: PointsService,
  ) {}

  async processOCR(
    filePath: string,
  ): Promise<{ text: string; type: 'pdf' | 'image' }> {
    try {
      const ext = path.extname(filePath).toLowerCase();
      let fullText = '';

      if (ext === '.pdf') {
        const buffer = fs.readFileSync(filePath);
        const data = await pdfParse(buffer);
        fullText = data.text?.trim() ?? '';
        fullText = fullText.replace(/([a-z])([A-Z])/g, '$1 $2');
        if (!fullText) throw new Error('Nenhum texto extraído do PDF.');
        return { text: fullText, type: 'pdf' };
      }

      const result = await Tesseract.recognize(filePath, 'por', {
        logger: (m) => console.log(m),
      });

      fullText = result.data?.text?.trim() ?? '';
      if (!fullText) throw new Error('Nenhum texto extraído da imagem.');
      return { text: fullText, type: 'image' };
    } catch (error) {
      console.error('Erro no OCR:', error);
      throw new InternalServerErrorException(
        'Erro ao processar OCR: ' + error.message,
      );
    }
  }

  async validateDocument(filePath: string): Promise<boolean> {
    try {
      const ext = path.extname(filePath).toLowerCase();

      if (!['.pdf', '.jpg', '.jpeg', '.png'].includes(ext)) {
        throw new BadRequestException(
          'Tipo de arquivo inválido. Apenas PDF, JPG, JPEG e PNG são permitidos.',
        );
      }

      const stats = fs.statSync(filePath);
      const fileSizeInMB = stats.size / (1024 * 1024);
      if (fileSizeInMB > 10) {
        throw new BadRequestException(
          'Arquivo muito grande. O tamanho máximo permitido é 10MB.',
        );
      }

      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

      const fileBuffer = fs.readFileSync(filePath);
      const base64File = fileBuffer.toString('base64');

      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Analise esta imagem e responda apenas com "sim" ou "não": Esta imagem parece ser um documento oficial de identificação pessoal, como RG, CPF, CNH ou Passaporte? (não forneça explicações)',
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/${ext.substring(1)};base64,${base64File}`,
                },
              },
            ],
          },
        ],
        max_tokens: 10,
      });

      const result = response.choices[0]?.message?.content?.toLowerCase();
      return result?.includes('sim') ?? false;
    } catch (error) {
      console.error('Erro na validação do documento:', error);
      throw new InternalServerErrorException(
        'Erro ao validar documento: ' + error.message,
      );
    }
  }

  async checkDuplicateDocumentType(
    userId: string,
    type: string,
  ): Promise<void> {
    const existingDocument = await this.prisma.document.findFirst({
      where: { userId, type },
    });

    if (existingDocument) {
      throw new BadRequestException(
        `Você já enviou um documento do tipo ${type.toUpperCase()}. Não é permitido enviar documentos duplicados.`,
      );
    }
  }

  async getLLMFormattedText(
    text: string,
  ): Promise<{ formattedText: string; explanation: string }> {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const formatted = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: `Corrija a estrutura do texto abaixo, separando palavras e deixando ele legível:\n\n${text}`,
        },
      ],
    });

    const explanation = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'user',
          content: `Explique ou forneça contexto para o seguinte texto:\n\n${text}`,
        },
      ],
    });

    return {
      formattedText: formatted.choices[0]?.message?.content?.trim() ?? '',
      explanation: explanation.choices[0]?.message?.content?.trim() ?? '',
    };
  }

  async saveDocument(userId: string, filename: string, type: string) {
    await this.checkDuplicateDocumentType(userId, type);

    const document = await this.prisma.document.create({
      data: { url: filename, userId, type },
    });

    await this.pointsService.addPoints(userId, 10, 'DOCUMENT_VALIDATION');

    return document;
  }

  async listDocuments(userId: string) {
    return this.prisma.document.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getDocument(id: string, userId: string) {
    return this.prisma.document.findFirst({
      where: { id, userId },
    });
  }

  async deleteDocument(id: string, userId: string) {
    const document = await this.prisma.document.findFirst({
      where: { id, userId },
    });

    if (!document) {
      throw new NotFoundException('Documento não encontrado.');
    }

    const filePath = join(__dirname, '../../uploads', document.url);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await this.prisma.document.delete({
      where: { id },
    });
  }
}
