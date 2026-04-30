import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService) {}
    private logger = new Logger('User service');

    async sendEmail(params: {to: string, subject: string, template: string, context: ISendMailOptions['context']}) {
        this.logger.log(`Sending email...`);
        try {
            const mailParams = {
                from: process.env.SMTP_FROM,
                to: params.to,
                subject: params.subject,
                template: params.template,
                context: params.context
            };

            const response = await this.mailerService.sendMail(mailParams);

            this.logger.log(
                `Email sent successfully to recipients with the following parameters : ${JSON.stringify(
                mailParams,
            )}`,
            response,
      );
        } catch (error) {
            this.logger.error(`Error while sending mail`, error );
            throw error;
        }
    }   
}
