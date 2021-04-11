import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { generate } from "password-hash";
import { IAccount, IMember, ISearch } from "src/interfaces/app.interface";
import { IMemberDocument } from "src/interfaces/member.interface";



@Injectable()
export class AdminService {

    constructor(@InjectModel('Member') private MemberCollection: Model<IMemberDocument>) { }

     //แก้ไชช้อมูลสมาชิก
     async updateAdminItem(memberID: any, body: IAccount) {
        const memberUpdate = await this.MemberCollection.findById(memberID);
        if (!memberUpdate) throw new BadRequestException('ไม่มีข้อมูลนี้ในระบบ');
        try {
            memberUpdate.username = body.username;
            memberUpdate.firstname = body.firstname;
            memberUpdate.lastname = body.lastname;
            memberUpdate.image = body.image || '';
            memberUpdate.role = body.role;
            memberUpdate.email = body.email;
            memberUpdate.telphone = body.telphone;
            memberUpdate.facebook = body.facebook;
            memberUpdate.line = body.line;


            if (body.password && body.password.trim() != '')
                memberUpdate.password = generate(body.password);

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


    //สร้างข้อมูลสมาชิกใหม่
    async createAdminItem(body: IAccount) {
        const count = await this.MemberCollection.countDocuments({ username: body.username });
        if (count > 0) throw new BadRequestException(`มีบัญชีผู้ใช้นี้อยู่ในระบบแล้ว`);
        body.password = generate(body.password);
        const memberCreate = await this.MemberCollection.create(body);
        memberCreate.id = memberCreate._id;
        memberCreate.username = body.username;
        memberCreate.password = body.password || '';
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

        await this.MemberCollection.create(memberCreate);
        memberCreate.password = '';
        memberCreate.macaddress = '';
        memberCreate.hashmac = '';
        return memberCreate;
    }

    async getAdminItems(searchOption: ISearch): Promise<IMember> {
        let queryItemFunction = () => this.MemberCollection.find({ 'role': 2 }, {
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
                case 'flagrsa': // เนื่องจาก ตัวแปร role จะทำการแปลงจาก enum เป้น int ไปแล้ว
                    conditions[type] = text;
                    conditions['role'] = 2;
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
                        role: 2,
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
                    conditions['role'] = 2;
                    queryItemFunction = () => this.MemberCollection.find(conditions, {
                        image: false,
                        password: false,
                        hashmac: false,
                        _id: false,
                    });      // {} คือ condition เอาไว้สำหรับ compiler จะมองเห็นเป้น type
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


}