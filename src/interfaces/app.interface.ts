// ข้อมูลสมาชิก  --v1
export interface IAccount {
    username: string;
    password: string;

    rsakey: string;
    flagrsa: FlagAccount;
    flagserver: string;
    macaddress: string;
    hashmac: string;
    // address: string;

    firstname: string;
    lastname: string;
    telphone: string;
    email: string;
    facebook: string;
    line: string;

    // address

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

// ลงทะเบียน --v1
export interface IRegister {
    username: string;
    password: string;

    rsakey: string;
    flagrsa: FlagAccount;
    flagserver: string;
    macaddress: string;
    hashmac: string;
    // address: string;
    firstname: string;
    lastname: string;
    telphone: string;
    email: string;
    facebook: string;
    line: string;

    // address

    latitude: string;
    longitude: string;
    organization: string;
    num: string;
    subdistrict: string;
    district: string;
    province: string;
    zipcode: string;

}

// เข้าสู่ระบบ --v1
export interface ILogin {
    username: string;
    password: string;
}

//------ ยังไม่แก้
// แก้ไขข้อมูลโปรไฟล์
export interface IProfile {

    firstname: string;
    lastname: string;
    telphone: string;
    email: string;
    facebook: string;
    line: string;
    image: string;
}

// หน้าเปลี่ยนรหัสผ่าน
export interface IChangePassword {
    old_pass: string;
    new_pass: string;
    cnew_pass: string;
}

// CRUD หน้า ค้นหาข้อมูล
export interface ISearch {
    searchType?: string;
    searchText?: string;
    startPage: number;
    limitPage: number;
}

// CRUD หน้า Member
export interface IMember {
    items: IAccount[];
    totalItems: number;
}

// สิทธ์ผู้ใช้งาน
export enum RoleAccount {
    Member = 1,
    Admin = 2,
    Superadmin = 3
}

// สถานะของ rsa user

export enum FlagAccount {
    Not_Have = 1,
    Have = 2,
    Approved = 3,
}


// SSH key
export interface IChangeSSHkey {
    new_key: string;
    flagUpdated: boolean;
}

export interface IChangeRSAkey {
    rsakey: string;
}

export interface IForgot {
    username: string;
    macaddress: string;
    newpassword: string;
    cpassword: string;
}

export interface IAddress {
    latitude: string;
    longitude: string;
    organization: string;
    num: string;
    subdistrict: string;
    district: string;
    province: string;
    zipcode: string;
}