"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUpdatePageInfoRequest = exports.validateCreatePageRequest = exports.validateAddBioSocialMediaLinkRequest = exports.validateAddBioLinkRequest = exports.validateModifySocialMediaLinkRequest = exports.validateModifyBioLinkRequest = void 0;
const CoreUtils_1 = require("./CoreUtils");
function validateModifyBioLinkRequest(request) {
    if (!request.id) {
        throw new Error("Id is required.");
    }
    if (!request.name) {
        throw new Error("Name is required.");
    }
    if (!request.url) {
        throw new Error("Url is required.");
    }
    (0, CoreUtils_1.validatePageId)(request.id);
    (0, CoreUtils_1.validateName)(request.name);
    (0, CoreUtils_1.validateUrl)(request.url);
}
exports.validateModifyBioLinkRequest = validateModifyBioLinkRequest;
function validateModifySocialMediaLinkRequest(request) {
    if (!request.id) {
        throw new Error("Id is required.");
    }
    if (!request.url) {
        throw new Error("Url is required.");
    }
    (0, CoreUtils_1.validatePageId)(request.id);
    (0, CoreUtils_1.validateUrl)(request.url);
}
exports.validateModifySocialMediaLinkRequest = validateModifySocialMediaLinkRequest;
function validateAddBioLinkRequest(request) {
    if (!request.name) {
        throw new Error("Name is required.");
    }
    if (!request.url) {
        throw new Error("Url is required.");
    }
    (0, CoreUtils_1.validateName)(request.name);
    (0, CoreUtils_1.validateUrl)(request.url);
}
exports.validateAddBioLinkRequest = validateAddBioLinkRequest;
function validateAddBioSocialMediaLinkRequest(request) {
    if (!request.url) {
        throw new Error("Url is required.");
    }
    (0, CoreUtils_1.validateUrl)(request.url);
}
exports.validateAddBioSocialMediaLinkRequest = validateAddBioSocialMediaLinkRequest;
function validateCreatePageRequest(request) {
    if (!request.id) {
        throw new Error("Id is required.");
    }
    if (!request.bioInfo) {
        throw new Error("BioInfo is required.");
    }
    (0, CoreUtils_1.validatePageId)(request.id);
    (0, CoreUtils_1.validateName)(request.bioInfo.name);
    (0, CoreUtils_1.validateUrlAllowingNull)(request.bioInfo.imageUrl);
    (0, CoreUtils_1.validateDescription)(request.bioInfo.descriptionTitle);
}
exports.validateCreatePageRequest = validateCreatePageRequest;
function validateUpdatePageInfoRequest(request) {
    if (!request.name) {
        throw new Error("Name is required.");
    }
    if (!request.descriptionTitle) {
        throw new Error("DescriptionTitle is required.");
    }
    (0, CoreUtils_1.validateName)(request.name);
    if (request.imageUrl) {
        (0, CoreUtils_1.validateUrl)(request.imageUrl);
    }
    (0, CoreUtils_1.validateDescription)(request.descriptionTitle);
}
exports.validateUpdatePageInfoRequest = validateUpdatePageInfoRequest;
