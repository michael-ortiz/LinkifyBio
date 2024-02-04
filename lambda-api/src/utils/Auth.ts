import { CognitoJwtVerifier } from "aws-jwt-verify";
import { Unauthorized } from "../excpetions/Exceptions";

const verifier = CognitoJwtVerifier.create({
    userPoolId: "us-east-1_T9mmYDsHW",
    tokenUse: "access",
    clientId: "52h01e8lv840k095a70nc5l9nf",
});

interface CognitoIdOrAccessTokenPayload {
    scope: string,
    exp: number,
    username: string
}

export async function validateToken(token: string | undefined): Promise<CognitoIdOrAccessTokenPayload> {

    // By pass token validation in local environment
    if (process.env.NODE_ENV === "local") {
        return {
            scope: "local",
            exp: 0,
            username: "local"
        }
    }

    if (!token) {
        throw new Unauthorized("Token not provided.");
    }

    try {
        const payload = await verifier.verify(
            token
        );
        return payload;
    } catch {
        throw new Unauthorized("Invalid token.");
    }
}