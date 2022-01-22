import {
    Controller,
    UseFilters,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Query,
    Param,
    HttpStatus,
    ParseIntPipe,
    UseGuards,
    SetMetadata,
} from '@nestjs/common';

import ProductService from './product.service';

import { BaseExceptionFilter, MongoExceptionFilter } from '../../filters';
import { AuthorizationGuard } from '../../guards';
import CustomValidationPipe from '../../pipes/validation.pipe';

import GeneralResDto from '../../common/dtos/res/general.res.dto';
import {
    ProductCreateReqDto,
    ProductUpdateReqDto,
    ProductResDto,
} from './dtos';

@Controller('/api/products')
@UseGuards(AuthorizationGuard)
@UseFilters(BaseExceptionFilter, MongoExceptionFilter)
export default class ProductController {
    constructor(private productService: ProductService) {}

    @Get('/:id')
    @SetMetadata('role', ['USER', 'ADMIN'])
    async findOne(
        @Param('id') id: string
    ): Promise<GeneralResDto<ProductResDto>> {
        const product = await this.productService.findOne(id);

        return {
            message: 'Success',
            statusCode: HttpStatus.OK,
            data: product,
        };
    }

    @Get('/')
    @SetMetadata('role', ['USER', 'ADMIN'])
    async findMany(
        @Query('page', ParseIntPipe) page: number,
        @Query('limit', ParseIntPipe) limit: number,
        @Query('sort') sort: {}
    ): Promise<GeneralResDto<ProductResDto[]>> {
        const products = await this.productService.findMany({
            sort,
            limit,
        });

        return {
            message: 'Success',
            statusCode: HttpStatus.OK,
            data: products,
            pageNumber: page,
        };
    }

    @Post('/')
    @SetMetadata('role', ['ADMIN'])
    async createOne(
        @Body(new CustomValidationPipe()) createDto: ProductCreateReqDto
    ): Promise<GeneralResDto<ProductResDto>> {
        const product = await this.productService.createOne(createDto);

        return {
            message: 'Success',
            statusCode: HttpStatus.CREATED,
            data: product,
        };
    }

    @Put('/:id')
    @SetMetadata('role', ['ADMIN'])
    async updateOne(
        @Param('id') id: string,
        @Body() updateDto: ProductUpdateReqDto
    ): Promise<GeneralResDto<ProductResDto>> {
        const product = await this.productService.updateOne(id, updateDto);

        return {
            message: 'Success',
            statusCode: HttpStatus.OK,
            data: product,
        };
    }

    @Delete('/:id')
    @SetMetadata('role', ['ADMIN'])
    async deleteOne(
        @Param('id') id: string
    ): Promise<GeneralResDto<ProductResDto>> {
        const product = await this.productService.deleteOne(id);

        return {
            message: 'Success',
            statusCode: HttpStatus.OK,
            data: product,
        };
    }
}
