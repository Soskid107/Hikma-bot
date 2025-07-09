import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './User';

@Entity('progress_tracking')
export class ProgressTracking {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User)
  user!: User;

  @Column({ default: 0 })
  total_days_completed!: number;

  @Column({ default: 0 })
  current_streak!: number;

  @Column({ default: 0 })
  longest_streak!: number;

  @Column({ nullable: true })
  last_active_date?: Date;

  @Column({ type: 'text', array: true, nullable: true })
  milestones_achieved?: string[];

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0.00 })
  completion_rate!: number;

  @Column({ default: 0 })
  healing_score!: number;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
