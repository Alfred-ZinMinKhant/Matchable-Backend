import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SessionsModule } from "./sessions/sessions.module";
import { BookingsModule } from "./bookings/bookings.module";
import { MailService } from "./mail/mail.service";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      url: process.env.DATABASE_URL,
      entities: [__dirname + "/**/*.entity{.ts,.js}"],
      synchronize: false,
      ssl: {
        rejectUnauthorized: false,
      },
    }),
    SessionsModule,
    BookingsModule,
  ],
  providers: [MailService],
})
export class AppModule {}
