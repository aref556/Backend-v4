import { IsNotEmpty, Matches } from "class-validator";
import { IChangePassword } from "src/interfaces/app.interface";
// import { IsComparePassword } from "src/pipes/validation.pipe";

export class ChangePasswordModel implements IChangePassword {

    // @IsNotEmpty()
    // @Matches(/^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})/)
    old_pass: string;

    // @IsNotEmpty()
    // @Matches(/^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})/)
    new_pass: string;

    // @IsNotEmpty()
    // @Matches(/^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})/)
    cnew_pass: string;
    
} 