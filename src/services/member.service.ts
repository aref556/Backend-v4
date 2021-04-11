import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { generate, verify } from "password-hash";
import { IAccount, IAddress, IChangePassword, IChangeRSAkey, IMember, IProfile, ISearch, RoleAccount } from "src/interfaces/app.interface";
import { IMemberDocument } from '../interfaces/member.interface'

@Injectable()
export class MemberService {

    constructor(@InjectModel('Member') private MemberCollection: Model<IMemberDocument>) {
        // จำลองข้อมูล member
        // const membes: IAccount[] = [];
        // for (let i = 0; i <= 100; i++) {
        //     membes.push({
        //         firstname: `firstname ${i}`,
        //         lastname: `Lastname ${i}`,
        //         email: `email${i}@mail.com`,
        //         password: generate(`password-${i}`),
        //         image: '',
        //         position: '',
        //         role: RoleAccount.Member
        //     })
        // }
        // const m1 = this.MemberCollection.create(membes, (err) => console.log(err)); //ตรวจสอบถ้าเป้น null ใช้การได้
    }

    //ลบข้อมูลสมาชิก
    async deleteMemberItem(memberID: any) {
        return await this.MemberCollection.deleteOne({ _id: memberID });
    }

    // อัพเดท flag
    async updataFlagofMemberItem(memberID: any) {
        const memberItem = await this.MemberCollection.findById(memberID);
        if (!memberItem) throw new BadRequestException('ไม่มีข้อมูลนี้ในระบบ');
        try {
            if (memberItem.flagrsa == 1) return memberItem;
            if (memberItem.flagrsa == 3) return memberItem;
            if (memberItem.flagrsa == 2) {
                await this.MemberCollection.updateOne({ _id: memberID }, {
                    flagrsa: 3,
                });
                const memberItemUpdate = await this.MemberCollection.findById(memberID);
                return memberItemUpdate;
            }
        }
        catch (ex) {
            throw new BadRequestException(ex.message);
        }
    }

    //แก้ไชช้อมูลสมาชิก
    async updateMemberItem(memberID: any, body: IAccount) {
        const memberUpdate = await this.MemberCollection.findById(memberID);
        if (!memberUpdate) throw new BadRequestException('ไม่มีข้อมูลนี้ในระบบ');
        try {
            memberUpdate.username = body.username;
            memberUpdate.firstname = body.firstname;
            memberUpdate.lastname = body.lastname;
            memberUpdate.image = body.image || '';
            memberUpdate.role = body.role;
            memberUpdate.email = body.email;
            memberUpdate.macaddress = body.macaddress;
            memberUpdate.telphone = body.telphone;
            memberUpdate.facebook = body.facebook;
            memberUpdate.line = body.line;

            memberUpdate.latitude = body.latitude;
            memberUpdate.longitude = body.longitude;
            memberUpdate.organization = body.organization;
            memberUpdate.num = body.num;
            memberUpdate.subdistrict = body.subdistrict;
            memberUpdate.district = body.district;
            memberUpdate.province = body.province;
            memberUpdate.zipcode = body.zipcode;

            if (body.password && body.password.trim() != '')
                memberUpdate.password = generate(body.password);
            if (body.macaddress && body.macaddress.trim() != '')
                memberUpdate.hashmac = generate(body.macaddress);

            const memberUpdateCount = await this.MemberCollection.countDocuments({ username: body.username });
            if (memberUpdate.username != body.username && memberUpdateCount > 0) throw new BadRequestException('บัญชีนี้มีในระบบแล้ว');

            const updated = await this.MemberCollection.updateOne({ _id: memberID }, memberUpdate);
            if (!updated.ok) throw new BadRequestException('ไม่สามารถแก้ไขข้อมูลได้');
            return await this.MemberCollection.findById(memberID, {
                password: false,
                hashmac: false,
            });

        }
        catch (ex) {
            throw new BadRequestException(ex.message);
        }
    }

   


    //แสดงข้อมูลสมาชิกคนเดียว
    async getMemberItem(memberID: any) {
        const memberItem = await this.MemberCollection.findById(memberID, {
            password: false,
            hashmac: false,
        });
        return memberItem;

    }

    //สร้างข้อมูลสมาชิกใหม่
    async createMemberItem(body: IAccount) {
        const count = await this.MemberCollection.countDocuments({ username: body.username });
        if (count > 0) throw new BadRequestException(`มีบัญชีผู้ใช้นี้อยู่ในระบบแล้ว`);
        body.password = generate(body.password);
        const memberCreate = await this.MemberCollection.create(body);
        memberCreate.id = memberCreate._id;
        memberCreate.username = body.username;
        memberCreate.password = body.password || '';
        memberCreate.macaddress = body.macaddress;
        memberCreate.hashmac = generate(body.macaddress);
        memberCreate.role = body.role;
        memberCreate.image = body.image;
        memberCreate.firstname = body.firstname;
        memberCreate.lastname = body.lastname;
        memberCreate.email = body.email;
        memberCreate.rsakey = '';
        memberCreate.flagrsa = 1;
        memberCreate.flagserver = '0';
        memberCreate.telphone = body.telphone;
        memberCreate.facebook = body.facebook;
        memberCreate.line = body.line;

        memberCreate.latitude = body.latitude;
        memberCreate.longitude = body.longitude;
        memberCreate.organization = body.organization;
        memberCreate.num = body.num;
        memberCreate.subdistrict = body.subdistrict;
        memberCreate.district = body.district;
        memberCreate.province = body.province;
        memberCreate.zipcode = body.zipcode;

        await this.MemberCollection.create(memberCreate);
        memberCreate.password = '';
        memberCreate.macaddress = '';
        memberCreate.hashmac = '';
        return memberCreate;
    }

    

    // แสดงข้อมูลสมาชิก
    async getMemberItems(searchOption: ISearch): Promise<IMember> {
        let queryItemFunction = () => this.MemberCollection.find({ 'role': 1 }, {
            image: false,
            password: false,
            hashmac: false,
            _id: false,
        }); // ตอนเสิชจะได้ไม่ต้องมา query ซ้ำๆ

        // ส่วนของการค้นหา
        if (searchOption.searchText && searchOption.searchType) {
            const text = searchOption.searchText;
            const type = searchOption.searchType;
            const conditions = {};
            switch (type) {
                // case ''
                case 'flagrsa': // เนื่องจาก ตัวแปร role จะทำการแปลงจาก enum เป้น int ไปแล้ว
                    conditions[type] = `${text}`;
                    conditions['role'] = 1;
                    // จริงๆเราต้องการ .find({email ไง แต่ email ที่ว่าดันเป็น text ไม่ใช่ type เลยต้องทำแบบนี้})
                    queryItemFunction = () => this.MemberCollection.find(conditions, {
                        image: false,
                        password: false,
                        hashmac: false,
                        _id: false,
                    });      // {} คือ condition เอาไว้สำหรับ compiler จะมองเห็นเป้น type
                    break;
                case 'updated':
                    // console.log(text); // ซึ่งแสดงเป็น object 2 ตัว คือ from กับ to
                    queryItemFunction = () => this.MemberCollection.find({
                        updated: { // กำสั่งพวกนนี้มาจาก mongoose 
                            $gt: text['from'],
                            $lt: text['to']
                        },
                        role: 1,
                    }, {
                        image: false,
                        password: false,
                        hashmac: false,
                        _id: false,
                    });
                    break;
                default:
                    conditions[type] = new RegExp(text, 'i');  // ใส่ i เพื่อให้สามารถค้นหาพิม์ใหญ่ พิม์เล็กได้
                    // จริงๆเราต้องการ .find({email ไง แต่ email ที่ว่าดันเป็น text ไม่ใช่ type เลยต้องทำแบบนี้})
                    conditions['role'] = 1;
                    queryItemFunction = () => this.MemberCollection.find(conditions, { image: false });      // {} คือ condition เอาไว้สำหรับ compiler จะมองเห็นเป้น type
                    break;
            }

        }

        // แบ่งหน้าเพจ
        const items = await queryItemFunction()
            // .find({}, { image: false }) // หาข้อมูลของ item โดยไม่เอา image
            .sort({ updated: -1 }) // -1 คือจากมากไปหาน้อย, 1 คือ จาก น้อยไปหามาก
            .skip((searchOption.startPage - 1) * searchOption.limitPage) // ฝั่ง frontend ตั้งไว้ = 1
            .limit(searchOption.limitPage); // โดยฝั่ง frontend ตั้งไว้ limitPage = 5
        // ผลรวมของหน้าเพจทั้งหมด 
        const totalItems = await queryItemFunction().countDocuments({});
        return { items, totalItems };
    }

  


    // เปลี่ยนรหัสผ่าน
    // async onChangeSSHkey(memberID: any, body: IChangeSSHkey) {
    //     // const memberItem = await this.MemberCollection.findById(memberID);
    //     const updated = await this.MemberCollection.updateOne({ _id: memberID }, <IAccount>{
    //         rsakey: body.new_key,
    //         updated: new Date(),
    //         flagrsa: true,
    //     });
    //     return updated;
    // }



    async onChangeRSAkey(memberID: any, body: IChangeRSAkey) {
        // const memberItem = await this.MemberCollection.findById(memberID);
        const updated = await this.MemberCollection.updateOne({ _id: memberID }, {
            rsakey: body.rsakey,
            flagrsa: 2,
        });
        if (!updated.ok) throw new BadRequestException('ข้อมูลนี้ไม่มีการเปลี่ยนแปลง');
        const memberItem = await this.MemberCollection.findById(memberID, {
            password: false,
            hashmac: false,
            _id: false,
        });
        return memberItem;
    }


    //เปลี่ยนแก้ไขสถานที่
    async onChangeAddress(memberID: any, body: IAddress) {
        const updated = await this.MemberCollection.updateOne({ _id: memberID }, {
            latitude: body.latitude,
            longitude: body.longitude,
            organization: body.organization,
            num: body.num,
            subdistrict: body.subdistrict,
            district: body.district,
            province: body.province,
            zipcode: body.zipcode,
        });
        if (!updated.ok) throw new BadRequestException('ข้อมูลนี้ไม่มีการเปลี่ยนแปลง');
        const memberItem = await this.MemberCollection.findById(memberID, {
            password: false,
            hashmac: false,
            _id: false,
        });
        return memberItem;

    }

    // เปลี่ยนรหัสผ่าน
    async onChangePassword(memberID: any, body: IChangePassword) {
        const memberItem = await this.MemberCollection.findById(memberID);
        if (!verify(body.old_pass, memberItem.password))
            throw new BadRequestException('รหัสผ่านเดิมไม่ถูกต้อง');
        const updated = await this.MemberCollection.updateOne({ _id: memberID }, <IAccount>{
            password: generate(body.new_pass),
        });
        return updated;
    }

    // แก้ไขข้อมูลดโปรไฟล์
    async onUpdateProfile(memberID: any, body: IProfile) {
        // return [memberID, body];
        const updated = await this.MemberCollection.updateOne({ _id: memberID }, {
            firstname: body.firstname,
            lastname: body.lastname,
            telphone: body.telphone,
            email: body.email,
            facebook: body.facebook,
            line: body.line,
            image: body.image,
        });
        if (!updated.ok) throw new BadRequestException('ข้อมูลนี้ไม่มีการเปลี่ยนแปลง');
        const memberItem = await this.MemberCollection.findById(memberID, {
            password: false,
            hashmac: false,
            _id: false,
        });

        return memberItem;

    }

}