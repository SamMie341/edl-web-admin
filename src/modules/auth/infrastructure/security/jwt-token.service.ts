import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { JwtPayload } from "../../domain/interfaces/jwt-payload.interface.js";
import { ITokenService } from "../../domain/services/token.service.interface.js";

@Injectable()
export class JwtTokenService implements ITokenService {
    constructor(private readonly jwtService: JwtService) { }

    sign(payload: JwtPayload): string {
        return this.jwtService.sign(payload);
    }
}
