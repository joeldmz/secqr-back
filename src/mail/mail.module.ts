import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/adapters/pug.adapter'
import { join } from 'path';
@Module({
  imports: [MailerModule.forRootAsync({
    useFactory: (): any => ({
      transport: {
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT,
          secure: true,
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
          },
          tls: {
            rejectUnauthorized: false,
          }
      },
      defaults: {
        from: process.env.SMTP_FROM,
      },
      template: {
        dir: join(__dirname,'..', '..', 'templates'),
        adapter: new PugAdapter(),
        options: {
          strict: true,
        },
      }
    })
  })
  ],
  controllers: [MailController],
  providers: [MailService],
})
export class MailModule {}
