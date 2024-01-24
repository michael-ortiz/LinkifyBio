"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeneralException = exports.Unauthorized = exports.NotFoundException = void 0;
class NotFoundException extends Error {
    constructor(message) {
        super(message || 'Not Found');
        this.status = 404;
    }
}
exports.NotFoundException = NotFoundException;
class Unauthorized extends Error {
    constructor(message) {
        super(message || 'Unauthorized');
        this.status = 401;
    }
}
exports.Unauthorized = Unauthorized;
class GeneralException extends Error {
    constructor(message) {
        super(message || 'Internal error');
        this.status = 500;
    }
}
exports.GeneralException = GeneralException;
