import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { LoginDto } from "../application/dtos/login.dto.js";
import { LoginUseCase } from "../application/use-cases/login.use-case.js";

@Controller('auth')
export class AuthController {
    constructor(private readonly loginUseCase: LoginUseCase) { }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() loginDto: LoginDto) {
        return this.loginUseCase.execute(loginDto);
    }
}
