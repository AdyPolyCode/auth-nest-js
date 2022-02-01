import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export default class GeneralResDto<I> {
    @ApiProperty({
        type: String,
        required: true,
        description: 'response message depends on success or false',
    })
    message: string;

    @ApiProperty({
        type: Number,
        required: true,
        description: 'response code depends on success or false',
    })
    statusCode: number;

    @ApiPropertyOptional({
        type: Object,
        description: 'response data',
    })
    data?: I;

    @ApiPropertyOptional({
        type: Number,
        description:
            'response page of successfully fetched x number of items (GET)',
    })
    pageNumber?: number;
}
