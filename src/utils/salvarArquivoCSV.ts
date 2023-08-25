import { HttpException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

export function salvarArquivoCSV(diretorio: string, nomeArquivo: string): void {
  if (!nomeArquivo.toLowerCase().endsWith('.csv')) {
    throw new HttpException('O arquivo deve ter a extensão .csv', 422);
  }

  const caminhoArquivo = path.join(diretorio, nomeArquivo);

  fs.writeFileSync(caminhoArquivo, 'utf-8');
}
