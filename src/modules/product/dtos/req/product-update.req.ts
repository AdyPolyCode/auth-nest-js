import { IsString, IsNumber, IsOptional } from 'class-validator';

export class ProductUpdateReqDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsNumber()
    price?: number;
}
