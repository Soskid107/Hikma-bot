import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('herbal_tips')
export class HerbalTip {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'text' })
  tip_text!: string;

  @Column({ length: 100 })
  herb_name!: string;

  @Column({ type: 'jsonb', nullable: true })
  local_names?: object;

  @Column({ length: 150, nullable: true })
  scientific_name?: string;

  @Column({ type: 'text', array: true, nullable: true })
  benefits?: string[];

  @Column({ type: 'text', nullable: true })
  usage_instructions?: string;

  @Column({ type: 'text', nullable: true })
  precautions?: string;

  @Column({ length: 50, nullable: true })
  seasonal_availability?: string;

  @Column({ length: 50, default: 'general' })
  category!: string;

  @Column({ length: 50, default: 'West Africa' })
  region!: string;

  @Column({ length: 255, nullable: true })
  image_url?: string;

  @CreateDateColumn()
  created_at!: Date;
}
