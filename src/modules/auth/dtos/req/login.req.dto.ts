import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginReqDto {
    @ApiProperty({
        description: 'User given email',
        type: String,
        required: true,
        example: 'okoko@example.com',
    })
    @IsNotEmpty()
    @IsString()
    email: string;

    @ApiProperty({
        description: 'User given password',
        type: String,
        required: true,
        example: 'okoko132',
    })
    @IsNotEmpty()
    @IsString()
    password: string;
}
