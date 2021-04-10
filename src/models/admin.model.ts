import { IsMACAddress, IsNotEmpty, Matches } from "class-validator";
import { FlagAccount, IAccount, RoleAccount } from "src/interfaces/app.interface";


export class CreateAdminModel implements IAccount {

    @IsNotEmpty()
    username: string;

    @Matches(/^[A-z0-9!@#$%^&*]{8,}$/)
    password: string;


    rsakey: string;
    flagrsa: FlagAccount;
    flagserver: string;
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
    id?: any;
    image?: string;
    role?: RoleAccount;
    created?: Date;
    updated?: Date;
    
}

export class UpdateAdminModel implements IAccount {
    username: string;
    password: string;
    rsakey: string;
    flagrsa: FlagAccount;
    flagserver: string;
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
    id?: any;
    image?: string;
    role?: RoleAccount;
    created?: Date;
    updated?: Date;

    
}