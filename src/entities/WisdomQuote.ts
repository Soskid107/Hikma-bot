import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('wisdom_quotes')
export class WisdomQuote {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'text' })
  quote_text!: string;

  @Column({ type: 'text', nullable: true })
  quote_arabic?: string;

  @Column({ length: 100, default: 'Ibn Sina' })
  author!: string;

  @Column({ length: 50, nullable: true })
  category?: string;

  @Column({ type: 'int', nullable: true })
  day_number?: number;

  @Column({ type: 'int', default: 1 })
  difficulty_level!: number;

  @Column({ type: 'text', nullable: true })
  extended_teaching?: string;

  @Column({ type: 'text', array: true, nullable: true })
  tags?: string[];

  @CreateDateColumn()
  created_at!: Date;
}
