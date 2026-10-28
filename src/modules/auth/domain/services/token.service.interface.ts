import { JwtPayload } from "../interfaces/jwt-payload.interface.js";

export const TOKEN_SERVICE = 'TOKEN_SERVICE';

export interface ITokenService {
    sign(payload: JwtPayload): string;
}
