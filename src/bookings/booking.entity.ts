import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Session } from '../sessions/session.entity';

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column('decimal', { precision: 10, scale: 2 })
  total_cost: number;

  @CreateDateColumn()
  created_at: Date;

  @ManyToMany(() => Session)
  @JoinTable({
    name: 'booking_sessions',
    joinColumn: { name: 'booking_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'session_id', referencedColumnName: 'id' },
  })
  sessions: Session[];
}
