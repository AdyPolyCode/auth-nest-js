import { IsString, IsNotEmpty } from 'class-validator';

export class ChangePasswordReqDto {
    @IsNotEmpty()
    @IsString()
    password: string;

    @IsNotEmpty()
    @IsString()
    passwordConfirm: string;
}
