import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId, isValidObjectId } from 'mongoose';
import * as csvParser from 'csv-parser';
import { Express } from 'express';
import { Readable } from 'stream';
import { Linha } from 'src/schemas/linha.schema';

@Injectable()
export class LinhaService {
  constructor(
    @InjectModel('Linha') private readonly linhaModel: Model<Linha>,
  ) {}

  async atualizarLinha(id: ObjectId, linhaData: any): Promise<Linha> {
    const objectIdIsValid = isValidObjectId(id);

    if (!objectIdIsValid) {
      throw new BadRequestException('ID inválido');
    }

    const linhaExistente = await this.linhaModel.findByIdAndUpdate(
      id,
      linhaData,
      { new: true },
    );

    if (!linhaExistente) {
      throw new NotFoundException('Linha não encontrada.');
    }

    return linhaExistente;
  }

  async listarLinhas() {
    return await this.linhaModel.find();
  }

  async deletarLinha(id: ObjectId) {
    const objectIdIsValid = isValidObjectId(id);

    if (!objectIdIsValid) {
      throw new BadRequestException('ID inválido');
    }

    const linhaDeletada = await this.linhaModel.findByIdAndDelete(id);

    if (!linhaDeletada) {
      throw new NotFoundException('Linha não encontrada.');
    }
  }

  async criarLinhasAPartirDoArquivo(file: Express.Multer.File): Promise<void> {
    const lines = [];
    const maxColumns = 12;

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
      .on('data', (line) => lines.push(line))
      .on('end', async () => {
        for (const lineData of lines) {
          const linha = new this.linhaModel(lineData);
          await linha.save();
        }
      });
  }
}
