import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ResetPasswordEmail } from './interface/resetPassword';

 
@Injectable()
export class EmailsService {
    constructor(private mailService: MailerService) {}

  async postHTMLEmail(resetPasswordEmail: ResetPasswordEmail) {
    console.log("Parametro:" + resetPasswordEmail);
    const response = await this.mailService.sendMail({
        to: resetPasswordEmail.correoElectronico,
        from: 'fritri.app@gmail.com',
        subject: 'Envío de contraseña temporal',
        template: 'resetPassword',
        context: {
            resetPassword:{
                nombreCompleto:resetPasswordEmail.nombreCompleto,
                contrasenaTemporal:resetPasswordEmail.contrasenaTemporal
            }
        },
    });
    console.log(response);
    return response;
}

}
