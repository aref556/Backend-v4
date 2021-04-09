import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { IAccount, RoleAccount } from "src/interfaces/app.interface";
import {Request} from 'express'


@Injectable()
export class RoleGuard implements CanActivate {
    private roles: RoleAccount[];
    constructor(..._roles: RoleAccount[]) {
        this.roles = _roles;
    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        //เก็ยค่า Request
        const request = context.switchToHttp().getRequest() as Request;
        
        // ตรวจสอบว่า มี user login เข้ามาหรือไม่
        if(request.user) {
            const userLogin = request.user as IAccount;
            // ค้นหาว่า User Login มี Role ตรงกับที่กำหนดมารึเปล่า
            const searchRoles = this.roles.filter(role => role == userLogin.role);
            return searchRoles.length > 0;
        }
        return false;
    }

}