import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { AUTH_USER_REPOSITORY } from "../../domain/repositories/auth-user.repository.interface.js";
import type { IAuthUserRepository } from "../../domain/repositories/auth-user.repository.interface.js";
import { PASSWORD_HASHER } from "../../domain/services/password-hasher.interface.js";
import type { IPasswordHasher } from "../../domain/services/password-hasher.interface.js";
import { TOKEN_SERVICE } from "../../domain/services/token.service.interface.js";
import type { ITokenService } from "../../domain/services/token.service.interface.js";
import { LoginDto } from "../dtos/login.dto.js";

@Injectable()
export class LoginUseCase {
    constructor(
        @Inject(AUTH_USER_REPOSITORY)
        private readonly userRepository: IAuthUserRepository,
        @Inject(PASSWORD_HASHER)
        private readonly passwordHasher: IPasswordHasher,
        @Inject(TOKEN_SERVICE)
        private readonly tokenService: ITokenService,
    ) { }

    async execute(dto: LoginDto) {
        const user = await this.userRepository.findByEmployeeCode(String(dto.empCode));

        if (!user) {
            throw new UnauthorizedException('ບໍ່ມີຂໍ້ມູນຜູ້ໃຊ້')
        }

        const isPasswordValid = await this.passwordHasher.compare(dto.password, user.passwordHash);

        if (!isPasswordValid) {
            throw new UnauthorizedException('ລະຫັດພະນັກງານ ຫຼື ລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ');
        }

        if (!user.isActive()) {
            throw new UnauthorizedException('ບັນຊີຂອງທ່ານຖືກລະງັບ');
        }

        await this.userRepository.updateLastLogin(user.id, new Date());

        return {
            accessToken: this.tokenService.sign(user.toJwtPayload()),
            user: user.toLoginProfile(),
        };
    }
}
