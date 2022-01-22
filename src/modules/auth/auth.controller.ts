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

@Controller('/api/auth')
@UseFilters(BaseExceptionFilter, MongoExceptionFilter)
export default class AuthController {
    constructor(private authService: AuthService) {}

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

    @Get('/logout')
    @UseGuards(AuthenticationGuard)
    async logout(
        @Headers('x-authorization') tokenString: string
    ): Promise<GeneralResDto<null>> {
        await this.authService.logout(tokenString);

        return { message: 'Success', statusCode: HttpStatus.OK };
    }

    @Post('/password-reset/:resetToken')
    async changePassword(
        @Param('resetToken') resetToken: string,
        @Body() changePasswordDto: ChangePasswordReqDto
    ): Promise<GeneralResDto<null>> {
        await this.authService.changePassword(resetToken, changePasswordDto);

        return { message: 'Success', statusCode: HttpStatus.OK };
    }

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

    @Post('/mail-confirmation/:mailToken')
    async confirmMail(
        @Param('mailToken') mailToken: string
    ): Promise<GeneralResDto<null>> {
        await this.authService.confirmMail(mailToken);

        return { message: 'Success', statusCode: HttpStatus.OK };
    }
}
