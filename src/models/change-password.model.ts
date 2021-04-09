import { IsNotEmpty, Matches } from "class-validator";
import { IChangePassword } from "src/interfaces/app.interface";
// import { IsComparePassword } from "src/pipes/validation.pipe";

export class ChangePasswordModel implements IChangePassword {

    @IsNotEmpty()
    old_pass: string;

    @IsNotEmpty()
    @Matches(/^[A-z0-9!@#$%^&*]{8,}$/)
    new_pass: string;

    @IsNotEmpty()
    @Matches(/^[A-z0-9!@#$%^&*]{8,}$/)
    cnew_pass: string;
    
} 