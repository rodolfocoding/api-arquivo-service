import * as mongoose from 'mongoose';
import { Arquivo } from '../models/arquivo.model';

export const LinhaSchema = new mongoose.Schema(
  {
    arquivo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Arquivo',
      required: true,
    },
    order: { type: Number, required: true },
    column01: { type: String, maxlength: 150 },
    column02: { type: String, maxlength: 150 },
    column03: { type: String, maxlength: 150 },
    column04: { type: String, maxlength: 150 },
    column05: { type: String, maxlength: 150 },
    column06: { type: String, maxlength: 150 },
    column07: { type: String, maxlength: 150 },
    column08: { type: String, maxlength: 150 },
    column09: { type: String, maxlength: 150 },
    column10: { type: String, maxlength: 150 },
    column11: { type: String, maxlength: 150 },
    column12: { type: String, maxlength: 150 },
  },
  { collection: 'linhas' },
);

export interface Linha extends mongoose.Document {
  arquivo: Arquivo;
  order: number;
  column01?: string;
  column02?: string;
  column03?: string;
  column04?: string;
  column05?: string;
  column06?: string;
  column07?: string;
  column08?: string;
  column09?: string;
  column10?: string;
  column11?: string;
  column12?: string;
}
