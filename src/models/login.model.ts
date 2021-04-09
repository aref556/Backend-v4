import { IsEmail, IsMACAddress, IsNotEmpty, Matches } from "class-validator";
import { ILogin } from "src/interfaces/app.interface";


export class LoginModel implements ILogin {
    
    // @IsNotEmpty()
    username: string;

    // @IsNotEmpty()
    // @Matches(/^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})/)
    password: string;
} 