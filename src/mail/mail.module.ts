import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/adapters/pug.adapter'

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
        from: process.env.FROM,
      },
      template: {
        dir: __dirname + '/../../templates',
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
