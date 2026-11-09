import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { AUTH_USER_REPOSITORY } from "../../domain/repositories/auth-user.repository.interface.js";
import type { IAuthUserRepository } from "../../domain/repositories/auth-user.repository.interface.js";

@Injectable()
export class GetProfileUseCase {
    constructor(
        @Inject(AUTH_USER_REPOSITORY)
        private readonly userRepository: IAuthUserRepository,
    ) { }

    async execute(userId: number) {
        const user = await this.userRepository.findById(userId);

        if (!user || !user.isActive()) {
            throw new UnauthorizedException('ຜູ້ໃຊ້ບໍ່ມີສິດເຂົ້າເຖິງ ຫຼື ບັນຊີຖືກລະງັບ');
        }

        return user.toLoginProfile();
    }
}
