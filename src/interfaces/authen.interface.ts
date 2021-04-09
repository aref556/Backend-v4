import { IMemberDocument } from './member.interface';

export interface IAuthen {
    generateAccessToken(member: IMemberDocument): Promise<string>;
    validateUser(accessToken): Promise<IMemberDocument>;
}