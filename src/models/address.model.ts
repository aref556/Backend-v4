import { IsLatitude, IsLongitude, IsNotEmpty } from "class-validator";
import { IAddress } from "src/interfaces/app.interface";

export class AddressModel implements IAddress {

    @IsNotEmpty()
    // @IsLatitude()
    latitude: string;

    @IsNotEmpty()
    // @IsLongitude()
    longitude: string;

    organization: string;
    num: string;
    subdistrict: string;
    district: string;
    province: string;
    zipcode: string;

}