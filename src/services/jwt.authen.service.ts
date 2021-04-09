import { Injectable, UnauthorizedException } from '@nestjs/common';
import { IAuthen } from '../interfaces/authen.interface';
import { IMemberDocument } from '../interfaces/member.interface';
import { sign } from 'jsonwebtoken';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class JwtAuthenService implements IAuthen {
    constructor(
        @InjectModel('Member') private MemberCollection: Model<IMemberDocument>,
    ) { }

    // ให้เจ้คิด secret key
    static secretKey: string = 'ICT Virtual Organization of ASEAN Institutes and NICT';

    // สร้าง Token
    async generateAccessToken(member: IMemberDocument) {
        const payload = { username: member.username };
        return sign(payload, JwtAuthenService.secretKey, { expiresIn: 60 * 60 });
    }

    // ยืนยันตัวตน
    async validateUser({ username }): Promise<IMemberDocument> {
        try {
            return this.MemberCollection.findOne({ username });
        }
        catch (e) { }
        return null;
    }
    //
}

@Injectable()
export class JwtAuthenStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: JwtAuthenService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: JwtAuthenService.secretKey,
        });
    }

    async validate(payload: { username: string }, done: Function) {
        const user = await this.authService.validateUser(payload);
        if (!user) {
            return done(new UnauthorizedException('ยังไม่ได้เข้าสู่ระบบ กรุณาเข้าสู่ระบบ'), false);
        }
        done(null, user);
    }
}