import { IsLatitude, IsLongitude, IsNotEmpty } from "class-validator";
import { IAddress } from "src/interfaces/app.interface";

export class AddressModel implements IAddress {

    @IsNotEmpty()
    @IsLatitude()
    latitude: string;

    @IsNotEmpty()
    @IsLongitude()
    longitude: string;

    @IsNotEmpty()
    organization: string;

    @IsNotEmpty()
    num: string;

    @IsNotEmpty()
    subdistrict: string;

    @IsNotEmpty()
    district: string;

    @IsNotEmpty()
    province: string;

    @IsNotEmpty()
    zipcode: string;

}