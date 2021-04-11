import { Injectable, BadRequestException, Body, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IMemberDocument } from '../interfaces/member.interface';
import { IAccount, IForgot, ILogin, IRegister } from '../interfaces/app.interface';
import { generate, verify } from 'password-hash';
import { JwtAuthenService } from './jwt.authen.service';
import * as f from 'fs';

@Injectable()
export class AppService {
  constructor(
    private authenService: JwtAuthenService,
    @InjectModel('Member') private MemberCollection: Model<IMemberDocument>
  ) { }

  public logger = new Logger(AppService.name);

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
    // const log = this.logger.log(`${body.username} ลอคอินแล้้ว`);
    // const data = new Uint8Array(Buffer.from('Hello Node.js'));
    // f.writeFile(`app.log.txt`, data, 'utf8', (err) => {
    //   if(err) throw err;
    //   console.log('ไม่ได้เซฟไฟล์ เนื่องจากข้อผิดพลาดบางอย่าง');
    // });

    return modelItem;

  }

  async onLogin(body: ILogin) {
    const member = await this.MemberCollection.findOne({ username: body.username });
    if (!member) throw new BadRequestException('ไม่พยข้อมูลการลงทะเบียนของผู้ใช้นี้');
    if (verify(body.password, member.password)) {
      await this.MemberCollection.updateOne({ username: body.username }, {
        updated: new Date(),
      });

      // เก็บ Log file
      const dataForLog = await this.MemberCollection.findOne({ username: body.username });
      const accessTokenGenerate = await this.authenService.generateAccessToken(member);
      const data = new Uint8Array(Buffer.from(
        ` เวลา ${new Date()} จาก {api/account/login, POST} ผู้ใช้ ${dataForLog.username} [id: ${dataForLog.id}] AccessToken [${accessTokenGenerate}] : Login เข้าสู่ระบบ \n`
      ));
      f.open('userlog.log', 'a', (err, fd) => {
        f.appendFile(fd, data, `utf8`, (err) => {
          f.close(fd, (err) => {
            if (err) throw err;
          });
          if (err) throw err;
        });
        if (err) throw err;
      });

      return { accessToken: accessTokenGenerate };
    }
    throw new BadRequestException('บัญชีผู้ใช้้หรือรหัสผ่านไม่ถูกต้อง');
  }

  async onForgot(body: IForgot) {
    const member = await this.MemberCollection.findOne({ username: body.username });
    if (!member) throw new BadRequestException('ไม่พบข้อมูลการลงทะเบียนของผู้ใช้นี้');
    // console.log(body.macaddress);
    // console.log(member.macaddress);
    if (verify(body.macaddress, member.hashmac)) {
      const updated = await this.MemberCollection.updateOne({ _id: member.id }, <IAccount>{
        password: generate(body.newpassword)
      });

      // เก็บ Log file
      const dataForLog = await this.MemberCollection.findOne({ username: body.username });
      const data = new Uint8Array(Buffer.from(
        ` เวลา ${new Date()} จาก {api/account/forgot-password, POST} ผู้ใช้ ${dataForLog.username} [id: ${dataForLog.id}] : ทำการรีเซ็ทรหัสผ่าน \n`
      ));
      f.open('userlog.log', 'a', (err, fd) => {
        f.appendFile(fd, data, `utf8`, (err) => {
          f.close(fd, (err) => {
            if (err) throw err;
          });
          if (err) throw err;
        });
        if (err) throw err;
      });

      return updated;
    }
    throw new BadRequestException('กรอกข้อมูลบางอย่างผิดพลาด กรุณากรอกใหม่');
  }
}
