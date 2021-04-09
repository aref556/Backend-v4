import { IAccount } from './app.interface';
import { Document } from 'mongoose';
export interface IMemberDocument extends IAccount, Document { }