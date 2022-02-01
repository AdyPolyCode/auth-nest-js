import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class ProductCreateReqDto {
    @ApiProperty({
        description: 'User given name',
        type: String,
        required: true,
        example: 'IPhone',
    })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({
        description: 'User given item description',
        type: String,
        required: true,
        example: 'High cost but easy use and user friendly design',
    })
    @IsNotEmpty()
    @IsString()
    description: string;

    @ApiProperty({
        description: 'User given item price',
        type: Number,
        required: true,
        example: 200,
    })
    @IsNotEmpty()
    @IsNumber()
    price: number;
}
