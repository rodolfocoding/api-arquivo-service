import { IsNotEmpty, IsString } from 'class-validator';

export class ArquivoDto {
  @IsNotEmpty()
  @IsString()
  fileName: string;

  @IsNotEmpty()
  @IsString()
  origin: string;

  totalLines?: number;
}
