import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'bigint', unique: true })
  telegram_id!: number;

  @Column({ length: 50, nullable: true })
  username?: string;

  @Column({ length: 100, nullable: true })
  first_name?: string;

  @Column({ length: 100, nullable: true })
  last_name?: string;

  @CreateDateColumn({ name: 'registration_date' })
  registration_date!: Date;

  @Column({ type: 'int', default: 1 })
  current_day!: number;

  @Column({ length: 50, default: 'Africa/Lagos' })
  timezone!: string;

  @Column({ length: 10, default: 'en' })
  language_preference!: string;

  @Column({ length: 20, default: '21_day' })
  healing_path!: string;

  @Column({ type: 'jsonb', nullable: true })
  healing_goals?: object;

  @Column({ default: true })
  is_active!: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  last_interaction!: Date;

  @Column({ type: 'jsonb', default: '{"morning": true, "evening": true, "wisdom": true}' })
  notification_settings!: object;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
