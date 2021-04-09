import { IsNotEmpty } from "class-validator";
import { ISearch } from "src/interfaces/app.interface";

export class SearchModel implements ISearch{
    searchType?: string;
    searchText?: string;

    @IsNotEmpty()
    startPage: number;

    @IsNotEmpty()
    limitPage: number;

}