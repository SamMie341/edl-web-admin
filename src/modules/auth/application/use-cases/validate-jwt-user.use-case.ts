import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { RequestUser } from "../../domain/entities/auth-user.entity.js";
import type { JwtPayload } from "../../domain/interfaces/jwt-payload.interface.js";
import { AUTH_USER_REPOSITORY } from "../../domain/repositories/auth-user.repository.interface.js";
import type { IAuthUserRepository } from "../../domain/repositories/auth-user.repository.interface.js";

@Injectable()
export class ValidateJwtUserUseCase {
    constructor(
        @Inject(AUTH_USER_REPOSITORY)
        private readonly userRepository: IAuthUserRepository,
    ) { }

    async execute(payload: JwtPayload): Promise<RequestUser> {
        const user = await this.userRepository.findById(payload.sub);

        if (!user || !user.isActive()) {
            throw new UnauthorizedException('ຜູ້ໃຊ້ບໍ່ມີສິດເຂົ້າເຖິງ ຫຼື ບັນຊີຖືກລະງັບ')
        }

        return user.toRequestUser();
    }
}
