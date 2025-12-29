import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty } from "class-validator";

export class LoginAuthDto {

    @IsEmail()
    @IsNotEmpty()
    @Transform(({ value }) => value.trim())
    email: string;

    @IsNotEmpty()
    password: string;

}
