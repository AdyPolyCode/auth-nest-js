import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class ProductCreateReqDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsNumber()
    price: number;
}
