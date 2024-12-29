import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('sessions')
export class Session {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: ['padel', 'fitness', 'tennis'] })
  type: string;

  @Column()
  trainer: string;

  @Column()
  time_slot: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @CreateDateColumn()
  created_at: Date;
}
