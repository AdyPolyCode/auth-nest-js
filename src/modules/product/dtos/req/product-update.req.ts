import { IsString, IsNumber, IsOptional } from 'class-validator';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ProductUpdateReqDto {
    @ApiPropertyOptional({
        description: 'User given name',
        type: String,
        example: 'IPhone',
    })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiPropertyOptional({
        description: 'User given item description',
        type: String,
        example: 'High cost but easy use and user friendly design',
    })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional({
        description: 'User given item price',
        type: Number,
        example: 200,
    })
    @IsOptional()
    @IsNumber()
    price?: number;
}
