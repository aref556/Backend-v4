import { Body, Controller, Get, Headers, Param, Post, Put, Query, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { RoleGuard } from "src/guards/role.guard";
import { RoleAccount } from "src/interfaces/app.interface";
import { AdminProfileModel } from "src/models/admin-profile.model";
import { CreateAdminModel, UpdateAdminModel } from "src/models/admin.model";
import { ParamMemberModel } from "src/models/member.model";
import { SearchModel } from "src/models/search.model";
import { ValidationPipe } from "src/pipes/validation.pipe";
import { AdminService } from "src/services/admin.service";
import { Request } from 'express';


@Controller('api/admin')
@UseGuards(AuthGuard('jwt'))
export class AdminController {
    constructor (private service: AdminService) { }

    @Get() // แสดงข้อมูลรายการสมาชิก
    @UseGuards(new RoleGuard(RoleAccount.Superadmin))
    showAdmin(@Query(new ValidationPipe()) query: SearchModel, @Headers() accesToken: any) {        
        query.startPage = parseInt(query.startPage as any);
        query.limitPage = parseInt(query.limitPage as any);
        return this.service.getAdminItems(query, accesToken['authorization']);
    }

    @Put(`:id`) // แก้ไขข้อมูลสมาชิกเดี่ยว
    @UseGuards(new RoleGuard(RoleAccount.Superadmin))
    updateAdmin(@Param(new ValidationPipe()) param: ParamMemberModel, @Body(new ValidationPipe()) body: UpdateAdminModel, @Headers() accessToken: any) {
        return this.service.updateAdminItem(param.id, body, accessToken['authorization']);
    }

    @Post() // เพิ่มข้อมูลสมาชิก
    @UseGuards(new RoleGuard(RoleAccount.Superadmin))
    createAdmin(@Body(new ValidationPipe()) body: CreateAdminModel, @Headers() accessToken: any) {
        return this.service.createAdminItem(body, accessToken['authorixation']);
    }

    @Post('profile-admin') // แก้ไขหน้าโปรไฟล์
    updateAdminProfile(@Req() req: Request, @Body(new ValidationPipe()) body: AdminProfileModel) {
        // console.log(req.user['id']);
        return this.service.onUpdateAdminProfile(req.user['id'], body);
    }

    
}