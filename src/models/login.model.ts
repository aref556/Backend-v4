import { IsEmail, IsMACAddress, IsNotEmpty, Matches } from "class-validator";
import { ILogin } from "src/interfaces/app.interface";


export class LoginModel implements ILogin {
    
    @IsNotEmpty()
    username: string;

    @IsNotEmpty()
    password: string;
} 