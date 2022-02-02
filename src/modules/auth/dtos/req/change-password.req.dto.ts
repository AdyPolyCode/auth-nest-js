import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordReqDto {
    @ApiProperty({
        description: 'User given first password',
        type: String,
        required: true,
        example: '123456789',
    })
    @IsNotEmpty()
    @IsString()
    password: string;

    @ApiProperty({
        description: 'User given second password',
        type: String,
        required: true,
        example: '123456789',
    })
    @IsNotEmpty()
    @IsString()
    passwordConfirm: string;
}
