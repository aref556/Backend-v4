import { Injectable, BadRequestException, Body } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IMemberDocument } from '../interfaces/member.interface';
import { IAccount, IForgot, ILogin, IRegister } from '../interfaces/app.interface';
import { generate, verify } from 'password-hash';
import { JwtAuthenService } from './jwt.authen.service';

@Injectable()
export class AppService {
    constructor(
        private authenService: JwtAuthenService,
        @InjectModel('Member') private MemberCollection: Model<IMemberDocument>
    ) { }

    // ลงทะเบียน
    async onRegister(body: IRegister) {
        const count = await this.MemberCollection.count({ username: body.username });
        if (count > 0) throw new BadRequestException('มีผู้ใช้นี้ในระบบแล้ว');
    
        const model: IAccount = body;
        model.password = body.password;
        model.username = body.username;
        model.role = 1;
        model.rsakey = '';
        model.flagrsa = 1;
        model.flagserver = '0';
        model.macaddress = body.macaddress;
        model.firstname = '';
        model.lastname = '';
        model.telphone = '';
        model.email = '';
        model.facebook = '';
        model.line = '';
        model.image = '';

        model.latitude = '';
        model.longitude = '';
        model.organization = '';
        model.num = '';
        model.subdistrict = '';
        model.district = '';
        model.province = '';
        model.zipcode = '';
    
        model.password = generate(model.password);
        model.hashmac = generate(model.macaddress);
    
        const modelItem = await this.MemberCollection.create(model);
        modelItem.id = modelItem._id;
        await this.MemberCollection.create(modelItem);
        modelItem.password = '';
        // console.log(modelItem);
        return modelItem;
    
      }

      async onLogin(body: ILogin) {
        const member = await this.MemberCollection.findOne({ username: body.username });
        if (!member) throw new BadRequestException('ไม่พยข้อมูลการลงทะเบียนของผู้ใช้นี้');
        if (verify(body.password, member.password)) {
          await this.MemberCollection.updateOne({username: body.username}, {
            updated: new Date(),
          });
          return { accessToken: await this.authenService.generateAccessToken(member)};
        }
        throw new BadRequestException('บัญชีผู้ใช้้หรือรหัสผ่านไม่ถูกต้อง');
      }

    async onForgot(body: IForgot) {
        const member = await this.MemberCollection.findOne({ username: body.username });
        if (!member) throw new BadRequestException('ไม่พบข้อมูลการลงทะเบียนของผู้ใช้นี้');
        console.log(body.macaddress);
        console.log(member.macaddress);
        if (verify(body.macaddress, member.hashmac)) {
            const updated = await this.MemberCollection.updateOne({ _id: member.id }, <IAccount>{
                password: generate(body.newpassword)
            });
            return updated;
        }
        throw new BadRequestException('กรอกข้อมูลบางอย่างผิดพลาด กรุณากรอกใหม่');
    }
}
