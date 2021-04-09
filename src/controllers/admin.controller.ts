import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { RoleGuard } from "src/guards/role.guard";
import { RoleAccount } from "src/interfaces/app.interface";
import { SearchModel } from "src/models/search.model";
import { ValidationPipe } from "src/pipes/validation.pipe";
import { MemberService } from "src/services/member.service";


@Controller()
@UseGuards(AuthGuard('jwt'))
export class AdminController {
    constructor (private service: MemberService) {
    }

    @Get() // แสดงข้อมูลรายการสมาชิก
    @UseGuards(new RoleGuard(RoleAccount.Superadmin))
    showMember(@Query(new ValidationPipe()) query: SearchModel) {
        query.startPage = parseInt(query.startPage as any);
        query.limitPage = parseInt(query.limitPage as any);
        return this.service.getAdminItems(query);
    }
    
}