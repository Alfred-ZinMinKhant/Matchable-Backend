import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionsModule } from './sessions/sessions.module';
import { BookingsModule } from './bookings/bookings.module';
import { MailService } from './mail/mail.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 8889,
      username: 'root',
      password: 'root',
      database: 'matchable',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    SessionsModule,
    BookingsModule,
  ],
  providers: [MailService],
})
export class AppModule {}
