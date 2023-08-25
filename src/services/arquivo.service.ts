import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import * as csvParser from 'csv-parser'; // Importe como csvParser
import mongoose, { Model } from 'mongoose';
import { ArquivoDto } from 'src/contracts/arquivo.dto';
import { Arquivo } from 'src/models/arquivo.model';
import { Linha } from 'src/schemas/linha.schema';
import { Repository } from 'typeorm';
import { Readable } from 'typeorm/platform/PlatformTools';

@Injectable()
export class ArquivoService {
  constructor(
    @InjectRepository(Arquivo)
    private readonly arquivoRepository: Repository<Arquivo>,

    @InjectModel('Linha') private readonly linhaModel: Model<Linha>,
  ) {}

  async criarArquivo(arquivoDto: ArquivoDto): Promise<Arquivo> {
    const novoArquivo = this.arquivoRepository.create(arquivoDto);
    return await this.arquivoRepository.save(novoArquivo);
  }

  async listarArquivos(): Promise<Arquivo[]> {
    const arquivos = await this.arquivoRepository.find();
    return arquivos;
  }

  async deletarArquivo(id: number) {
    await this.arquivoRepository.delete(id);
  }

  async atualizarTotalLines(
    nomeArquivo: string,
    totalLines: number,
  ): Promise<void> {
    const arquivo = await this.arquivoRepository.findOne({
      where: { fileName: nomeArquivo },
    });

    if (!arquivo) {
      throw new NotFoundException('Arquivo não encontrado.');
    }

    arquivo.totalLines = totalLines;
    await this.arquivoRepository.save(arquivo);
  }

  async criarLinhasAPartirDoArquivo(
    file: Express.Multer.File,
    origin: string,
  ): Promise<void> {
    const lines = [];
    const maxColumns = 12;

    const novoArquivo: any = this.criarArquivo({
      fileName: file.originalname,
      origin, // Defina a origem conforme suas necessidades
    });

    let order = 0; // Inicializa o valor do order

    const fileStream = new Readable();
    fileStream.push(file.buffer);
    fileStream.push(null);

    fileStream
      .pipe(csvParser())
      .on('headers', (headers) => {
        if (headers.length > maxColumns) {
          throw new BadRequestException(
            'O arquivo excede o número máximo de colunas.',
          );
        }
      })
      .on('data', (line) => {
        lines.push(line);
      })
      .on('end', async () => {
        for (const lineData of lines) {
          order++;
          const inputKeys = Object.keys(lineData)[0];
          const inputValues: any = Object.values(lineData)[0];
          const columnNames = inputKeys.split(';');
          const columnValues = inputValues.split(';');

          const outputObject: any = {};

          columnNames.forEach((columnName, index) => {
            outputObject[columnName] = columnValues[index];
          });

          const linha = new this.linhaModel({
            arquivo: new mongoose.mongo.ObjectId(novoArquivo.id),
            column01: outputObject?.COLUMN_1,
            column02: outputObject?.COLUMN_2,
            column03: outputObject?.COLUMN_3,
            column04: outputObject?.COLUMN_4,
            column05: outputObject?.COLUMN_5,
            column06: outputObject?.COLUMN_6,
            column07: outputObject?.COLUMN_7,
            column08: outputObject?.COLUMN_8,
            column09: outputObject?.COLUMN_9,
            column10: outputObject?.COLUMN_10,
            column11: outputObject?.COLUMN_11,
            column12: outputObject?.COLUMN_12,
            order,
          });
          await linha.save();
        }

        await this.atualizarTotalLines(file.originalname, lines.length);
      });
  }
}
