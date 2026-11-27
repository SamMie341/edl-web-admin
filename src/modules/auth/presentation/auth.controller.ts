import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from "@nestjs/common";
import { LoginDto } from "../application/dtos/login.dto.js";
import { LoginUseCase } from "../application/use-cases/login.use-case.js";
import { GetProfileUseCase } from "../application/use-cases/get-profile.use-case.js";
import { JwtAuthGuard } from "./guards/jwt-auth.guard.js";
import { CurrentUser } from "../../../core/decorators/current-user.decorator.js";
import type { RequestUser } from "../domain/entities/auth-user.entity.js";

@Controller('auth')
export class AuthController {
    constructor(
        private readonly loginUseCase: LoginUseCase,
        private readonly getProfileUseCase: GetProfileUseCase,
    ) { }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() loginDto: LoginDto) {
        return this.loginUseCase.execute(loginDto);
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    async getProfile(@CurrentUser() user: RequestUser) {
        return this.getProfileUseCase.execute(user.id);
    }
}
