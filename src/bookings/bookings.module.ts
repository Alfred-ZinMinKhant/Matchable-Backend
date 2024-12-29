import { Module } from '@nestjs/common';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { MailService } from '../mail/mail.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './booking.entity';
import { Session } from '../sessions/session.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Booking, Session])],
  controllers: [BookingsController],
  providers: [BookingsService, MailService],
})
export class BookingsModule {}
