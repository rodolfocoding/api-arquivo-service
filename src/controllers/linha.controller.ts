import { Body, Controller, Delete, Get, Param, Patch } from '@nestjs/common';
import { ObjectId } from 'mongoose';
import { Linha } from 'src/schemas/linha.schema';
import { LinhaService } from 'src/services/linha.service';

@Controller('linhas')
export class LinhaController {
  constructor(private readonly linhaService: LinhaService) {}

  @Get('/')
  async listarLinhas() {
    const linhas = await this.linhaService.listarLinhas();
    return linhas;
  }

  @Patch(':id')
  async atualizarLinha(
    @Param('id') id: ObjectId,
    @Body() linhaData: Linha, // Use o DTO apropriado se você tiver um
  ) {
    const linhaAtualizada = await this.linhaService.atualizarLinha(
      id,
      linhaData,
    );
    return linhaAtualizada;
  }

  @Delete(':id')
  async deletarLinha(@Param('id') id: ObjectId) {
    await this.linhaService.deletarLinha(id);
  }
}
