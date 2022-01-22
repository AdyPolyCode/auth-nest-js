import { IsString, IsNotEmpty } from 'class-validator';

export class LoginReqDto {
    @IsNotEmpty()
    @IsString()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}
