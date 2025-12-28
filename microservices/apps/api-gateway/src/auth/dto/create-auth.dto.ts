import { Transform, Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsEmail, IsNotEmpty, IsOptional, IsString, Matches, matches, MinLength } from "class-validator";

export class CreateAuthDto {

    @IsEmail()
    @IsNotEmpty()
    @Transform(({ value }) => value.trim())
    email: string;
    @IsNotEmpty()
    password: string;
    confirmPassword: string;
}
