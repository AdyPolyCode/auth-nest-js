import { IsString, IsNotEmpty } from 'class-validator';

export class ForgotPasswordReqDto {
    @IsNotEmpty()
    @IsString()
    email: string;
}
