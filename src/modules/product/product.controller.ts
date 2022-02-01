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

import {
    ApiCreatedResponse,
    ApiNotFoundResponse,
    ApiForbiddenResponse,
    ApiOkResponse,
    ApiConflictResponse,
    ApiUnprocessableEntityResponse,
    ApiBadRequestResponse,
    ApiUnauthorizedResponse,
    ApiTags,
    ApiQuery,
    ApiOperation,
} from '@nestjs/swagger';

@ApiTags('products')
@Controller('/api/products')
@UseGuards(AuthorizationGuard)
@UseFilters(BaseExceptionFilter, MongoExceptionFilter)
export default class ProductController {
    constructor(private productService: ProductService) {}

    @ApiOperation({
        summary: 'Fetch single product',
        description:
            'Request from client will query the database and the data will be sent on success. Response body as JSON format will contain and object with some properties. Can be performed either by USER or ADMIN.',
        parameters: [
            {
                in: 'path',
                name: 'id',
                required: true,
                description:
                    'for single product query the path parameter "id" is required',
            },
        ],
    })
    @ApiOkResponse({
        status: 200,
        description: 'Product has been successfully sent',
        type: ProductResDto,
    })
    @ApiBadRequestResponse({
        description: 'Product was not found due to wrong path identifier',
        schema: { example: { message: 'Wrong path identifier' } },
    })
    @ApiUnauthorizedResponse({
        description: 'Unathorized user identity',
        schema: { example: { message: 'Unathorized' } },
    })
    @ApiNotFoundResponse({
        description: 'Product was not found due to something',
        schema: { example: { message: 'Product was not found' } },
    })
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

    @ApiOperation({
        summary: 'Fetch multiple products',
        description:
            'Request from client will query the database and the data will be sent on success. Response body as JSON format will contain and object with some properties. Can be performed either by USER or ADMIN.',
    })
    @ApiOkResponse({
        status: 200,
        description: 'Product has been successfully sent',
        type: ProductResDto,
    })
    @ApiUnauthorizedResponse({
        description: 'Unathorized user identity',
        schema: { example: { message: 'Unathorized' } },
    })
    @ApiConflictResponse({
        description: 'Product might be already created',
        schema: { example: { message: 'Conflict' } },
    })
    @ApiQuery({
        name: 'page',
        type: Number,
        required: false,
    })
    @ApiQuery({
        name: 'limit',
        type: Number,
        required: false,
    })
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

    @ApiOperation({
        summary: 'Create single product',
        description:
            'Request from client along with body data will be sent to the API and on success the database will populate/save the given data object. Can be performed only by ADMIN.',
        requestBody: { $ref: '', required: true },
    })
    @ApiCreatedResponse({
        description: 'Product has been successfully created',
        type: ProductResDto,
    })
    @ApiUnprocessableEntityResponse({
        description: 'Product was not created due to missing property',
        schema: { example: { message: 'Validation error' } },
    })
    @ApiForbiddenResponse({
        description: 'User is not allowed to make this move',
        schema: { example: { message: 'Unathorized' } },
    })
    @ApiUnauthorizedResponse({
        description: 'Unathorized user identity',
        schema: { example: { message: 'Unathorized' } },
    })
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

    @ApiOperation({
        summary: 'Update single product',
        description:
            'Request from client along with body data will be sent to the API and on success the database will update/save the data object. Can be performed only by ADMIN.',
        parameters: [
            {
                in: 'path',
                name: 'id',
                required: true,
                description:
                    'for single product query the path parameter "id" is required',
            },
        ],
        requestBody: {
            $ref: '',
            required: true,
        },
    })
    @ApiOkResponse({
        status: 200,
        description: 'Product has been successfully updated',
        type: ProductResDto,
    })
    @ApiBadRequestResponse({
        description: 'Product was not found due to wrong path identifier',
        schema: { example: { message: 'Wrong path identifier' } },
    })
    @ApiUnauthorizedResponse({
        description: 'Unathorized user identity',
        schema: { example: { message: 'Unathorized' } },
    })
    @ApiForbiddenResponse({
        description: 'User is not allowed to make this move',
        schema: { example: { message: 'Unathorized' } },
    })
    @ApiNotFoundResponse({
        description: 'Product was not found due to something',
        schema: { example: { message: 'Product was not found' } },
    })
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

    @ApiOperation({
        summary: 'Delete single product',
        description:
            'Request from client will be sent to the API and on success the database will delete the data object. Can be performed only by ADMIN.',
        parameters: [
            {
                in: 'path',
                name: 'id',
                required: true,
                description:
                    'for single product query the path parameter "id" is required',
            },
        ],
    })
    @ApiOkResponse({
        status: 200,
        description: 'Product has been successfully updated',
        type: ProductResDto,
    })
    @ApiBadRequestResponse({
        description: 'Product was not found due to wrong path identifier',
        schema: { example: { message: 'Wrong path identifier' } },
    })
    @ApiUnauthorizedResponse({
        description: 'Unathorized user identity',
        schema: { example: { message: 'Unathorized' } },
    })
    @ApiForbiddenResponse({
        description: 'User is not allowed to make this move',
        schema: { example: { message: 'Unathorized' } },
    })
    @ApiNotFoundResponse({
        description: 'Product was not found due to something',
        schema: { example: { message: 'Product was not found' } },
    })
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
