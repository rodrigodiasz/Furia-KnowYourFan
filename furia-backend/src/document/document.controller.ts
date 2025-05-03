import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Req,
  UseGuards,
  BadRequestException,
  Get,
  Param,
  Res,
  Delete,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join, extname } from 'path';
import { Request, Response } from 'express';
import { JwtAuthGuard } from 'src/users/jwt-auth.guard';
import { DocumentService } from './document.service';

@Controller('documents')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async listDocuments(@Req() req: Request) {
    const userId = (req as any).user.userId;
    return this.documentService.listDocuments(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/download')
  async downloadDocument(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const userId = (req as any).user.userId;
    const document = await this.documentService.getDocument(id, userId);

    if (!document) {
      throw new BadRequestException('Documento não encontrado.');
    }

    const filePath = join(__dirname, '../../uploads', document.url);
    res.download(filePath);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteDocument(@Param('id') id: string, @Req() req: Request) {
    const userId = (req as any).user.userId;
    await this.documentService.deleteDocument(id, userId);
    return { message: 'Documento excluído com sucesso.' };
  }

  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: join(__dirname, '../../uploads'),
        filename: (_req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(
            null,
            file.fieldname + '-' + uniqueSuffix + extname(file.originalname),
          );
        },
      }),
    }),
  )
  async uploadDocument(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    if (!file) {
      throw new BadRequestException('Nenhum arquivo enviado.');
    }

    const documentType = req.body.type;
    if (!documentType) {
      throw new BadRequestException('Tipo de documento não especificado.');
    }

    const isValidDocument = await this.documentService.validateDocument(
      file.path,
    );

    if (!isValidDocument) {
      throw new BadRequestException(
        'Documento inválido. Envie um documento oficial de identidade.',
      );
    }

    await this.documentService.saveDocument(
      (req as any).user.userId,
      file.filename,
      documentType,
    );

    return {
      success: true,
      message: 'Documento validado e salvo com sucesso.',
    };
  }
}
