import { Schema } from 'mongoose';
export const accessTokenSchema = new Schema({
    memberID: {
        type: Schema.Types.ObjectId,
        ref: 'Member'
    },
    accessToken: String,
    exprise: Date,
    created: {
        type: Date,
        default: Date.now
    }
},);