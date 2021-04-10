import { Body, Controller, Get, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { RoleGuard } from "src/guards/role.guard";
import { RoleAccount } from "src/interfaces/app.interface";
import { CreateAdminModel, UpdateAdminModel } from "src/models/admin.model";
import { ParamMemberModel } from "src/models/member.model";
import { SearchModel } from "src/models/search.model";
import { ValidationPipe } from "src/pipes/validation.pipe";
import { MemberService } from "src/services/member.service";


@Controller('api/admin')
@UseGuards(AuthGuard('jwt'))
export class AdminController {
    constructor (private service: MemberService) { }

    @Get() // แสดงข้อมูลรายการสมาชิก
    @UseGuards(new RoleGuard(RoleAccount.Superadmin))
    showAdmin(@Query(new ValidationPipe()) query: SearchModel) {
        query.startPage = parseInt(query.startPage as any);
        query.limitPage = parseInt(query.limitPage as any);
        return this.service.getAdminItems(query);
    }

    @Put(`:id`) // แก้ไขข้อมูลสมาชิกเดี่ยว
    @UseGuards(new RoleGuard(RoleAccount.Superadmin))
    updateAdmin(@Param(new ValidationPipe()) param: ParamMemberModel, @Body(new ValidationPipe()) body: UpdateAdminModel) {
        return this.service.updateMemberItem(param.id, body);
    }

    @Post() // เพิ่มข้อมูลสมาชิก
    @UseGuards(new RoleGuard(RoleAccount.Admin, RoleAccount.Superadmin))
    createAdmin(@Body(new ValidationPipe()) body: CreateAdminModel) {
        return this.service.createMemberItem(body);
    }




    
    
}