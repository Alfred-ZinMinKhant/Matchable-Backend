import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Session } from '../sessions/session.entity';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT, 10),
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  // Function to send booking confirmation email
  async sendBookingConfirmation(
    email: string,
    name: string,
    sessions: Session[],
  ) {
    const sessionDetails = sessions
      .map(
        (session) => `
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">${session.type}</td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">$${session.price}</td>
          </tr>
        `,
      )
      .join('');

    // Calculating the total cost and ensuring it's a number
    const totalCost = sessions.reduce(
      (total, session) => total + session.price,
      0,
    );
    const formattedTotalCost = Number(totalCost).toFixed(2); // Ensuring it's a number

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Booking Confirmation',
      html: `
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
              }
              .email-container {
                width: 100%;
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                border-radius: 8px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                overflow: hidden;
                padding: 20px;
              }
              h1 {
                color: #333;
                text-align: center;
                font-size: 24px;
              }
              p {
                color: #555;
                font-size: 16px;
                line-height: 1.6;
              }
              .session-table {
                width: 100%;
                margin-top: 20px;
                border-collapse: collapse;
              }
              .session-table th, .session-table td {
                padding: 12px;
                text-align: left;
              }
              .session-table th {
                background-color: #f8f8f8;
              }
              .total-cost {
                font-size: 18px;
                font-weight: bold;
                margin-top: 20px;
                text-align: center;
                color: #333;
              }
              .footer {
                margin-top: 40px;
                text-align: center;
                font-size: 14px;
                color: #888;
              }
            </style>
          </head>
          <body>
            <div class="email-container">
              <h1>Thank you for your booking, ${name}!</h1>
              <p>We are excited to confirm your booking. Below are the details of your sessions:</p>
              
              <table class="session-table">
                <thead>
                  <tr>
                    <th>Session Type</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${sessionDetails}
                </tbody>
              </table>

              <p class="total-cost">Total cost: $${formattedTotalCost}</p>

              <p>We look forward to seeing you!</p>
              <div class="footer">
                <p>If you have any questions, feel free to contact us.</p>
                <p>&copy; ${new Date().getFullYear()} Matchable. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Confirmation email sent to:', email);
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send confirmation email');
    }
  }
}
