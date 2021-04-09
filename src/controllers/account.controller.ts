import { Controller, Get, Post, Body, BadRequestException, Logger } from '@nestjs/common';
import { fstat } from 'node:fs';
import { CombineLatestSubscriber } from 'rxjs/internal/observable/combineLatest';
import { ForgotModel } from 'src/models/forgot-password.model';
import { LoginModel } from 'src/models/login.model';
import { RegisterModel } from '../models/register.model';
import { ValidationPipe } from '../pipes/validation.pipe';
import { AppService } from '../services/app.service';

@Controller('api/account')
export class AccountController {
    constructor(
        private service: AppService,
    ) { }

    private logger = new Logger(AccountController.name);

    @Post('register') // ลงทะเบียน
    register(@Body(new ValidationPipe()) body: RegisterModel) {
        return this.service.onRegister(body);
    }

    @Post('login') // เข้าสู่ระบบ
    login(@Body(new ValidationPipe()) body: LoginModel) {
        this.logger.log('ทำการลอคอิน');
        return this.service.onLogin(body);
    }

    @Post('forgot-password')
    forgot(@Body(new ValidationPipe()) body: ForgotModel) {
        return this.service.onForgot(body);
    }

}   