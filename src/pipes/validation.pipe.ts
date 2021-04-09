import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { validate, ValidationOptions, registerDecorator, ValidationArguments } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { RoleAccount } from '../interfaces/app.interface';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {

    async transform(value, { metatype }: ArgumentMetadata) {
        if (!metatype || !this.toValidate(metatype)) {
            return value;
        }
        const object = plainToClass(metatype, value);
        const errors = await validate(object);
        if (errors.length > 0) {
            const constraints = errors.map(m => m.constraints);
            if (constraints.length > 0) {
                const constraint = constraints[0];
                const message = Object.keys(constraint).map(key => constraint[key]);
                if (message.length > 0) {
                    throw new BadRequestException(message[message.length - 1]);
                }
            }
            throw new BadRequestException('Validation faild.');
        }
        return value;
    }

    private toValidate(metatype): boolean {
        const types = [String, Boolean, Number, Array, Object];
        return !types.find((type) => metatype === type);
    }

}

// Custom validation ตรวจสอบ password และ confirm password
export function IsComparePassword(property: string, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        if (validationOptions == undefined) {
            validationOptions = {};
            validationOptions.message = 'password and confirm password do not match.';
        }
        registerDecorator({
            name: "IsComparePassword",
            target: object.constructor,
            propertyName: propertyName,
            constraints: [property],
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    return args.object[property] === value;
                }
            }
        });
    };
}
// Custom validation ตรวจสอบ Role account ว่ามีในระบบหรือไม่
export function IsRoleAccount(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        if (validationOptions == undefined) {
            validationOptions = {};
            validationOptions.message = 'role account do not match.';
        }
        registerDecorator({
            name: "IsRoleAccount",
            target: object.constructor,
            propertyName: propertyName,
            constraints: [],
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    return RoleAccount[value] != undefined;
                }
            }
        });
    };
}