import { MailerService } from '@nestjs-modules/mailer';
import { Controller, Get, Query } from '@nestjs/common';
 
@Controller('email')
export class EmailController {
    constructor(private mailService: MailerService) {}

    @Get('plain-text-email')
    async plainTextEmail(@Query('toemail') toEmail) {
        var response = await this.mailService.sendMail({
            to:toEmail,
            from:"ahidalgoj@ucenfotec.ac.cr",
            subject: 'Plain Text Email ✔',
            text: 'Welcome NestJS Email Sending Tutorial', 
        });
        return response;
    }
}