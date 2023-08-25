import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { Arquivo } from './models/arquivo.model';
import { ConfigModule } from '@nestjs/config';
import { ArquivoController } from './controllers/arquivo.controller';
import { ArquivoService } from './services/arquivo.service';
import { LinhaSchema } from './schemas/linha.schema';
import { LinhaController } from './controllers/linha.controller';
import { LinhaService } from './services/linha.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT, 10),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        entities: [Arquivo],
        synchronize: true,
      }),
    }),
    TypeOrmModule.forFeature([Arquivo]),
    MongooseModule.forRoot(
      `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.qkmop.mongodb.net/?retryWrites=true&w=majority`,
    ),
    MongooseModule.forFeature([{ name: 'Linha', schema: LinhaSchema }]),
  ],
  controllers: [ArquivoController, LinhaController],
  providers: [
    {
      provide: ArquivoService,
      useClass: ArquivoService,
    },
    {
      provide: LinhaService,
      useClass: LinhaService,
    },
  ],
})
export class AppModule {}
