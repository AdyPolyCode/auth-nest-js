import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterReqDto {
    @ApiProperty({
        description: 'User given username',
        type: String,
        required: true,
        example: 'hablabla',
    })
    @IsNotEmpty()
    @IsString()
    username: string;

    @ApiProperty({
        description: 'User given email',
        type: String,
        required: true,
        example: 'hablabla@example.com',
    })
    @IsNotEmpty()
    @IsString()
    email: string;

    @ApiProperty({
        description: 'User given password',
        type: String,
        required: true,
        example: 'hablabla123',
    })
    @IsNotEmpty()
    @IsString()
    password: string;
}
