import { Module } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { AppService } from './services/app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { memberSchema } from './schemas/member.schema';
import { AccountController } from './controllers/account.controller';
import { MemberController } from './controllers/member.controller';
import { JwtAuthenService, JwtAuthenStrategy } from './services/jwt.authen.service';
import { MemberService } from './services/member.service';
import { AdminController } from './controllers/admin.controller';
import { AdminService } from './services/admin.service';

@Module({
    imports: [
        MongooseModule.forRoot('mongodb://localhost/member_db'),
        MongooseModule.forFeature([
            { name: 'Member', schema: memberSchema },
        ])
    ],
    controllers: [
        AppController,
        AccountController,
        MemberController,
        AdminController,
    ],
    providers: [
        AppService,
        JwtAuthenService,
        JwtAuthenStrategy,
        MemberService,
        AdminService,
    ]
})
export class AppModule { }
