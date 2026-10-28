import { Global, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { LoginUseCase } from "./application/use-cases/login.use-case.js";
import { ValidateJwtUserUseCase } from "./application/use-cases/validate-jwt-user.use-case.js";
import { AUTH_USER_REPOSITORY } from "./domain/repositories/auth-user.repository.interface.js";
import { PASSWORD_HASHER } from "./domain/services/password-hasher.interface.js";
import { TOKEN_SERVICE } from "./domain/services/token.service.interface.js";
import { PrismaAuthUserRepository } from "./infrastructure/database/prisma-auth-user.repository.js";
import { BcryptPasswordHasher } from "./infrastructure/security/bcrypt-password-hasher.service.js";
import { JwtTokenService } from "./infrastructure/security/jwt-token.service.js";
import { JwtStrategy } from "./infrastructure/strategies/jwt.strategy.js";
import { AuthController } from "./presentation/auth.controller.js";

@Global()
@Module({
    imports: [
        PassportModule.register({
            defaultStrategy: 'jwt',
        }),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.getOrThrow<string>('JWT_SECRET'),
                signOptions: {
                    expiresIn: (configService.get<string>('JWT_EXPIRES_IN') || '1d') as any,
                },
            }),
        }),
    ],
    controllers: [AuthController],
    providers: [
        LoginUseCase,
        ValidateJwtUserUseCase,
        JwtStrategy,
        {
            provide: AUTH_USER_REPOSITORY,
            useClass: PrismaAuthUserRepository,
        },
        {
            provide: PASSWORD_HASHER,
            useClass: BcryptPasswordHasher,
        },
        {
            provide: TOKEN_SERVICE,
            useClass: JwtTokenService,
        },
    ],
    exports: [PASSWORD_HASHER, PassportModule, JwtModule],
})
export class AuthModule { }
