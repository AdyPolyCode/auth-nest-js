import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordReqDto {
    @ApiProperty({
        description: 'User given email',
        type: String,
        required: true,
        example: 'asdfa@example.com',
    })
    @IsNotEmpty()
    @IsString()
    email: string;
}
