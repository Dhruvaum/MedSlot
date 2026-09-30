import { jwtDecode } from "jwt-decode";

export interface TokenPayload{
    sub: string
    role: string
    exp: number
}

export const decodeToken = (token: string) => jwtDecode<TokenPayload>(token);

export const isTokenExpired = (token: string) => {
    const {exp} = jwtDecode(token);

    return Date.now() >= exp*1000;
}