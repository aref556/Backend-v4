import { IsNotEmpty } from "class-validator";
import { IProfile } from "src/interfaces/app.interface";

export class ProfileModel implements IProfile{
    @IsNotEmpty()
    firstname: string;

    @IsNotEmpty()
    lastname: string;

    // @IsNotEmpty()
    telphone: string;

    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    facebook: string;

    @IsNotEmpty()
    line: string;

    image: string;

}