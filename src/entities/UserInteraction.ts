import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './User';

@Entity('user_interactions')
export class UserInteraction {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User)
  user!: User;

  @Column({ length: 50 })
  interaction_type!: string;

  @Column({ length: 100, nullable: true })
  command_used?: string;

  @Column({ type: 'jsonb', nullable: true })
  response_data?: object;

  @CreateDateColumn()
  timestamp!: Date;
}