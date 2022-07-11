import { MailerService } from '@nestjs-modules/mailer';
import { Controller, Get, Query, Post, Body } from '@nestjs/common';
 
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

    @Post('html-email')
    async postHTMLEmail(@Body() resetPassword: any) {
        var response = await this.mailService.sendMail({
            to: 'andreshj28@hotmail.com',
            from: 'fritri.app@gmail.com',
            subject: 'HTML Dynamic Template',
            template: 'resetPassword',
            context: {
                resetPassword:resetPassword
            },
        });
        console.log(response);
        return 'success';
    }
}