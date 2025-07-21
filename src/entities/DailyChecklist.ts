import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './User';

@Entity('daily_checklist')
export class DailyChecklist {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User)
  user!: User;

  @Column()
  day_number!: number;

  @Column()
  checklist_date!: Date;

  // Store personalized checklist items as JSON
  @Column('simple-json', { default: [] })
  checklist_items!: Array<{
    id: string;
    text: string;
    completed: boolean;
    order: number;
  }>;

  // Store personalized content
  @Column('text', { nullable: true })
  daily_focus?: string;

  @Column('text', { nullable: true })
  daily_tip?: string;

  @Column('text', { nullable: true })
  daily_quote?: string;

  @Column({ default: 0 })
  completion_percentage!: number;

  @Column({ nullable: true })
  completed_at?: Date;

  @CreateDateColumn()
  created_at!: Date;
}
