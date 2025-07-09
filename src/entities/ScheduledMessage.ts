import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './User';

@Entity('scheduled_messages')
export class ScheduledMessage {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User)
  user!: User;

  @Column({ length: 50 })
  message_type!: string;

  @Column({ type: 'time' })
  scheduled_time!: string;

  @Column({ length: 50 })
  timezone!: string;

  @Column({ default: true })
  is_active!: boolean;

  @Column({ nullable: true })
  last_sent?: Date;

  @CreateDateColumn()
  created_at!: Date;
}
