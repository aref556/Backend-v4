import { IsMACAddress, IsMongoId, IsNotEmpty, Matches } from "class-validator";
import { FlagAccount, IAccount, RoleAccount } from "src/interfaces/app.interface";

export class CreateMemberModel implements IAccount {
    date_new: Date;
    @IsNotEmpty()
    username: string;

    @IsNotEmpty()
    @Matches(/^[A-z0-9!@#$%^&*]{8,}$/)
    password: string;


    rsakey: string;
    flagrsa: FlagAccount;
    flagserver: string;


    @IsNotEmpty()
    @IsMACAddress()
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

    @IsNotEmpty()
    role?: RoleAccount;


    created?: Date;
    updated?: Date;
    
    
    
}
export class UpdateMemberModel implements IAccount {
    
    @IsNotEmpty()
    username: string;
    password: string;
    rsakey: string;
    flagrsa: FlagAccount;
    flagserver: string;

    @IsNotEmpty()
    @IsMACAddress()
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

export class ParamMemberModel {
    @IsMongoId()
    id: number;
}