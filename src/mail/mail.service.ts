import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import * as path from 'path';
import * as pug from 'pug';
import { Resend } from 'resend';
@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService) {}
    private logger = new Logger('User service');
    private resend = new Resend(process.env.RESEND_API_KEY);

    async sendEmail(params: {to: string, subject: string, template: string, context: ISendMailOptions['context']}) {
        this.logger.log(`Sending email...`);
        try {
            /* const mailParams = {
                from: process.env.SMTP_FROM,
                to: params.to,
                subject: params.subject,
                template: params.template,
                context: params.context
            }; 

            const response = await this.mailerService.sendMail(mailParams); */
            
            const templatePath = path.join(__dirname,'..', '..', `templates/${params.template}.pug`);
            const html = pug.renderFile(templatePath, { ...params.context });

            const mailParams = {
                from: process.env.RESEND_DOMAIN ?? '',
                to: params.to,
                subject: params.subject,
                html: html
            };

            const response = await this.resend.emails.send(mailParams);

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
