import { IsNotEmpty } from "class-validator";
import { IChangeRSAkey } from "src/interfaces/app.interface";

export class ChangeRSAkeyModel implements IChangeRSAkey {


    // @IsNotEmpty()
    rsakey: string;

    
}