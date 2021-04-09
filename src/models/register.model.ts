import { IsNotEmpty, IsNumber, Matches } from "class-validator";

import { FlagAccount, IRegister, RoleAccount } from "src/interfaces/app.interface";

export class RegisterModel implements IRegister {

    @IsNotEmpty()
    username: string;

    @IsNotEmpty()
    password: string;

    rsakey: string;
    flagrsa: FlagAccount;

    macaddress: string;
    hashmac: string;

    firstname: string;
    lastname: string;
    telphone: string;
    email: string;
    facebook: string;
    line: string;

    latitude: string;
    longitude: string;
    organization: string;
    num: string;
    subdistrict: string;
    district: string;
    province: string;
    zipcode: string;
   
    

}