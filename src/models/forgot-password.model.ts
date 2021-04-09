import { IsMACAddress, IsNotEmpty } from "class-validator";
import { IForgot } from "src/interfaces/app.interface";

export class ForgotModel implements IForgot{

    // @IsNotEmpty()
    username: string;

    // @IsNotEmpty()
    // @IsMACAddress()
    macaddress: string;

    // @IsNotEmpty()
    newpassword: string;

    // @IsNotEmpty()
    cpassword: string;

}