import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Arquivo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500 })
  fileName: string;

  @Column({ length: 200 })
  origin: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ default: 0 })
  totalLines?: number;
}
