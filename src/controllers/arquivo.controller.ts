import {
  Controller,
  Post,
  Body,
  Get,
  HttpException,
  Delete,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiServiceUnavailableResponse, ApiTags } from '@nestjs/swagger';
import { ArquivoDto } from 'src/contracts/arquivo.dto';
import { Arquivo } from 'src/models/arquivo.model';
import { ArquivoService } from 'src/services/arquivo.service';

@Controller('arquivos')
@ApiTags('arquivos')
@ApiServiceUnavailableResponse({
  description: 'Service unavailable',
  type: Error,
})
export class ArquivoController {
  constructor(private readonly arquivoService: ArquivoService) {}

  @Post('/')
  async criarArquivo(@Body() data: ArquivoDto): Promise<Arquivo> {
    try {
      return await this.arquivoService.criarArquivo(data);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Get('/')
  async listarArquivos(): Promise<Arquivo[]> {
    try {
      return await this.arquivoService.listarArquivos();
    } catch (error) {
      return error;
    }
  }
  @Delete('/')
  async deletarArquivo(@Query() id: number) {
    try {
      return await this.arquivoService.deletarArquivo(id);
    } catch (error) {
      return error;
    }
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() origin: string,
  ): Promise<void> {
    await this.arquivoService.criarLinhasAPartirDoArquivo(file, origin);
  }
}
