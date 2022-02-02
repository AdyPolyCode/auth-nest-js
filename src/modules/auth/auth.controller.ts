import {
    Controller,
    UseFilters,
    UseGuards,
    Get,
    Post,
    Body,
    Param,
    Headers,
    HttpStatus,
} from '@nestjs/common';

import AuthService from './auth.service';

import { BaseExceptionFilter, MongoExceptionFilter } from '../../filters';
import { AuthenticationGuard } from '../../guards';
import CustomValidationPipe from '../../pipes/validation.pipe';

import GeneralResDto from '../../common/dtos/res/general.res.dto';
import {
    RegisterReqDto,
    LoginReqDto,
    ChangePasswordReqDto,
    ForgotPasswordReqDto,
    RegisterResDto,
    LoginResDto,
    ForgotPasswordResDto,
} from './dtos';

import {
    ApiCreatedResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiConflictResponse,
    ApiUnprocessableEntityResponse,
    ApiUnauthorizedResponse,
    ApiTags,
    ApiQuery,
    ApiOperation,
    ApiBadRequestResponse,
    ApiHeader,
} from '@nestjs/swagger';

@ApiTags('auth')
@Controller('/api/auth')
@UseFilters(BaseExceptionFilter, MongoExceptionFilter)
export default class AuthController {
    constructor(private authService: AuthService) {}

    @ApiOperation({
        summary: 'User registration',
        description:
            'Email, username and password must be provided from client, if valid successfully forwarded to other endpoint else if some data is missing from body then an error is thrown or if either email or username does exist also an error is thrown.',
        requestBody: {
            $ref: '#/dtos/req/register.req.dto.ts',
            required: true,
        },
    })
    @ApiCreatedResponse({
        description: 'User successfully created',
        schema: {
            example: {
                message: 'success',
                data: { token: 'qewsdaeerfsfqeqdaeqeqe' },
            },
        },
    })
    @ApiConflictResponse({
        description: 'User might be already created (unique property)',
        schema: { example: { message: 'Conflict' } },
    })
    @ApiUnprocessableEntityResponse({
        description: 'Not registered due to missing property',
        schema: { example: { message: 'Validation error' } },
    })
    @Post('/register')
    async register(
        @Body(new CustomValidationPipe()) registerDto: RegisterReqDto
    ): Promise<GeneralResDto<RegisterResDto>> {
        const data = await this.authService.register(registerDto);

        return {
            message: 'Success',
            statusCode: HttpStatus.CREATED,
            data: {
                token: data.authToken.tokenString,
                url: data.url,
            },
        };
    }

    @ApiOperation({
        summary: 'User login',
        description:
            'Email and password must be provided from client, if valid successfully forwarded to other endpoint else if wron email address is given an error is thrown or if some required data is missing from body also an error is thrown.',
        requestBody: {
            $ref: '#/dtos/req/login.req.dto.ts',
            required: true,
        },
    })
    @ApiOkResponse({
        description: 'User successfully logged in',
        schema: {
            example: {
                message: 'success',
                data: { token: 'qewsdaeerfsfqeqdaeqeqe' },
            },
        },
    })
    @ApiUnprocessableEntityResponse({
        description: 'Not logged in due to missing property',
        schema: { example: { message: 'Validation error' } },
    })
    @ApiNotFoundResponse({
        description: 'Given user was not found',
        schema: { example: { message: 'Not found' } },
    })
    @Post('/login')
    async login(
        @Body(new CustomValidationPipe()) loginDto: LoginReqDto
    ): Promise<GeneralResDto<LoginResDto>> {
        const data = await this.authService.login(loginDto);

        return {
            message: 'Success',
            statusCode: HttpStatus.OK,
            data: {
                user: {
                    userId: data.user._id,
                    username: data.user.username,
                },
                token: data.authToken.tokenString,
            },
        };
    }

    @ApiOperation({
        summary: 'User logout',
        description:
            'Valid tokenstring must be provided / user has to be authenticated in order to use this type of endpoint, if not then an unauthorized error is thrown else user also has to be verified by email confirmation if not then another error is thrown, finally if no valid user role is provided error is thrown.',
    })
    @ApiOkResponse({
        description: 'User successfully logged in',
        schema: {
            example: {
                message: 'success',
            },
        },
    })
    @ApiUnauthorizedResponse({
        description: 'Invalid auth credentials',
        schema: { example: { message: 'Unauthorized' } },
    })
    @ApiBadRequestResponse({
        description: 'Given user is not verified',
        schema: { example: { message: 'Bad request' } },
    })
    @ApiHeader({ name: 'x-authorization', required: true })
    @Get('/logout')
    @UseGuards(AuthenticationGuard)
    async logout(
        @Headers('x-authorization') tokenString: string
    ): Promise<GeneralResDto<null>> {
        await this.authService.logout(tokenString);

        return { message: 'Success', statusCode: HttpStatus.OK };
    }

    @ApiOperation({
        summary: 'User reset password',
        description:
            'Valid token must be provided in order to successfully finish the operation, if not then an error is thrown.',
        requestBody: {
            $ref: '#/dtos/req/change-password.req.dto.ts',
            required: true,
        },
    })
    @ApiOkResponse({
        description: 'Password successfully changed',
        schema: {
            example: {
                message: 'success',
            },
        },
    })
    @ApiUnauthorizedResponse({
        description: 'Cannot access due to an invalid token',
        schema: { example: { message: 'Unauthorized' } },
    })
    @ApiUnprocessableEntityResponse({
        description: 'Passwords does not match',
        schema: { example: { message: 'Validation error' } },
    })
    @ApiQuery({ name: 'resetToken', required: true })
    @Post('/password-reset/:resetToken')
    async changePassword(
        @Param('resetToken') resetToken: string,
        @Body() changePasswordDto: ChangePasswordReqDto
    ): Promise<GeneralResDto<null>> {
        await this.authService.changePassword(resetToken, changePasswordDto);

        return { message: 'Success', statusCode: HttpStatus.OK };
    }

    @ApiOperation({
        summary: 'User forgot password',
        description:
            'Valid user email must be provided in order to successfully receive a password reset email, if not then an not found error is thrown.',
        requestBody: {
            $ref: '#/dtos/req/forgot-password.req.dto.ts',
            required: true,
        },
    })
    @ApiOkResponse({
        description: 'Reset mail successfully sent',
        schema: {
            example: {
                message: 'success',
            },
        },
    })
    @ApiNotFoundResponse({
        description: 'User email was not found',
        schema: {
            example: {
                message: 'User not found',
            },
        },
    })
    @Post('/forgot-password')
    async forgotPassword(
        @Body(new CustomValidationPipe())
        forgotPasswordDto: ForgotPasswordReqDto
    ): Promise<GeneralResDto<ForgotPasswordResDto>> {
        const data = await this.authService.forgotPassword(
            forgotPasswordDto.email
        );

        return {
            message: 'Success',
            statusCode: HttpStatus.OK,
            data: {
                url: data,
            },
        };
    }

    @ApiOperation({
        summary: 'User forgot password',
        description:
            'Valid token must be provided in order to successfully finish the operation, if not then an error is thrown',
    })
    @ApiOkResponse({
        description: 'User email successfully confirmed',
        schema: {
            example: {
                message: 'success',
            },
        },
    })
    @ApiUnauthorizedResponse({
        description: 'Cannot access due to an invalid token',
        schema: {
            example: {
                message: 'Unauthorized',
            },
        },
    })
    @ApiQuery({
        name: 'mailToken',
        required: true,
    })
    @Post('/mail-confirmation/:mailToken')
    async confirmMail(
        @Param('mailToken') mailToken: string
    ): Promise<GeneralResDto<null>> {
        await this.authService.confirmMail(mailToken);

        return { message: 'Success', statusCode: HttpStatus.OK };
    }
}
