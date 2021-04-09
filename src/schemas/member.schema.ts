import { Schema } from 'mongoose';

export const memberSchema = new Schema({
    username: String,
    password: String,

    firstname: String,
    lastname: String,
    email: String,

    telphone: String,
    facebook: String,
    line: String,
    image: String,
    role: Number,

    rsakey: String,
    flagrsa: Number,
    macaddress: String,
    hashmac: String,
// address

    latitude: String,
    longitude: String,
    organization: String,
    num: String,
    subdistrict: String,
    district: String,
    province: String,
    zipcode: String,

    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date,
        default: Date.now
    },
    id: String
});
