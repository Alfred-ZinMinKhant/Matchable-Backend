import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './booking.entity';
import { Session } from '../sessions/session.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
    private readonly mailService: MailService, // Inject the MailService
  ) {}

  async create(createBookingDto: CreateBookingDto) {
    const { name, email, phone, sessions } = createBookingDto;

    // Check if sessions are provided
    if (!sessions || sessions.length === 0) {
      throw new Error('Sessions are required for booking');
    }

    // Fetch sessions from the database
    const selectedSessions = await this.sessionRepository.findByIds(sessions);

    if (!selectedSessions || selectedSessions.length !== sessions.length) {
      throw new Error('One or more sessions not found');
    }

    // Calculate the total cost
    const totalCost = selectedSessions.reduce(
      (acc, session) => acc + session.price,
      0,
    );

    // Create the booking
    const booking = this.bookingRepository.create({
      name,
      email,
      phone,
      total_cost: totalCost, // Use snake_case here
    });

    const savedBooking = await this.bookingRepository.save(booking);

    // Create the many-to-many relationship between booking and sessions
    for (const session of selectedSessions) {
      await this.bookingRepository
        .createQueryBuilder()
        .relation(Booking, 'sessions')
        .of(savedBooking.id)
        .add(session.id);
    }

    // Send confirmation email to the user
    try {
      await this.mailService.sendBookingConfirmation(
        email,
        name,
        selectedSessions,
      );
    } catch (error) {
      console.error('Error sending confirmation email:', error);
    }

    return savedBooking;
  }
}
