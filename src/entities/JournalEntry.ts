import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './User';

@Entity('journal_entries')
export class JournalEntry {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User)
  user!: User;

  @Column()
  entry_date!: Date;

  @Column({ type: 'text', nullable: true })
  entry_text?: string;

  @Column({ type: 'int', nullable: true })
  mood_rating?: number;

  @Column({ type: 'int', nullable: true })
  energy_level?: number;

  @Column({ type: 'int', nullable: true })
  sleep_quality?: number;

  @Column({ type: 'text', nullable: true })
  physical_symptoms?: string;

  @Column({ type: 'text', nullable: true })
  spiritual_notes?: string;

  @CreateDateColumn()
  created_at!: Date;
}
