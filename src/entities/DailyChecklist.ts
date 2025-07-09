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

  @Column({ default: false })
  warm_water!: boolean;

  @Column({ default: false })
  black_seed_garlic!: boolean;

  @Column({ default: false })
  light_food_before_8pm!: boolean;

  @Column({ default: false })
  sleep_time!: boolean;

  @Column({ default: false })
  thought_clearing!: boolean;

  @Column({ default: 0 })
  completion_percentage!: number;

  @Column({ nullable: true })
  completed_at?: Date;

  @CreateDateColumn()
  created_at!: Date;
}
