"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateToken = void 0;
const aws_jwt_verify_1 = require("aws-jwt-verify");
const Exceptions_1 = require("../excpetions/Exceptions");
const verifier = aws_jwt_verify_1.CognitoJwtVerifier.create({
    userPoolId: "us-east-1_T9mmYDsHW",
    tokenUse: "access",
    clientId: "52h01e8lv840k095a70nc5l9nf",
});
function validateToken(token) {
    return __awaiter(this, void 0, void 0, function* () {
        // By pass token validation in local environment
        if (process.env.NODE_ENV === "local") {
            return {
                scope: "local",
                exp: 0,
                username: "local"
            };
        }
        if (!token) {
            throw new Exceptions_1.Unauthorized("Token not provided.");
        }
        try {
            const payload = yield verifier.verify(token);
            return payload;
        }
        catch (_a) {
            throw new Exceptions_1.Unauthorized("Invalid token.");
        }
    });
}
exports.validateToken = validateToken;
