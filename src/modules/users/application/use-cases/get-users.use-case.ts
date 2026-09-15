import { Inject, Injectable } from "@nestjs/common";
import * as userRepositoryInterface from "../../domain/repositories/user.repository.interface.js";

@Injectable()
export class GetUsersUseCase {
    constructor(
        @Inject(userRepositoryInterface.USER_REPOSITORY)
        private readonly userrepository: userRepositoryInterface.IUserRepository,
    ) { }

    async execute() {
        return this.userrepository.findAll();
    }
}