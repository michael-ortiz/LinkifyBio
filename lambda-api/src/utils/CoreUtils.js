"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfileImageUrl = exports.validatePageColors = exports.validateDescription = exports.validateName = exports.validateUrl = exports.validateUrlAllowingNull = exports.validateLinkId = exports.validatePageId = exports.formatUrl = void 0;
const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const urlRegex = /[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;
const pageIdRegex = /^[a-zA-Z0-9-]*$/;
const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
const phoneNumberRegex = /^(tel:)?\+?[1-9]\d{1,14}$/;
const uuidv4Regex = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-4[0-9a-fA-F]{3}\b-[89abAB][0-9a-fA-F]{3}\b-[0-9a-fA-F]{12}$/;
function formatUrl(url) {
    if (emailRegex.test(url)) {
        return `mailto:${url}`;
    }
    if (urlRegex.test(url)) {
        if (url.startsWith("http://") || url.startsWith("https://")) {
            return url;
        }
        return "https://" + url;
    }
    if (phoneNumberRegex.test(url)) {
        if (url.startsWith("tel:")) {
            return url;
        }
        return `tel:${url}`;
    }
    throw Error("Invalid url.");
}
exports.formatUrl = formatUrl;
function validatePageId(id) {
    if (!pageIdRegex.test(id)) {
        throw new Error("Id can only contain letters and dashes.");
    }
    if (id.length > 120) {
        throw new Error("Id cannot be longer than 120 characters.");
    }
}
exports.validatePageId = validatePageId;
function validateLinkId(linkId) {
    // Validate linkId is a UUID v4
    if (!uuidv4Regex.test(linkId)) {
        throw new Error("Invalid linkId.");
    }
}
exports.validateLinkId = validateLinkId;
function validateUrlAllowingNull(url) {
    if (!url) {
        return;
    }
    if (!urlRegex.test(url)) {
        throw new Error("Url is invalid.");
    }
}
exports.validateUrlAllowingNull = validateUrlAllowingNull;
function validateUrl(url) {
    if (!urlRegex.test(url) && !emailRegex.test(url) && !phoneNumberRegex.test(url)) {
        throw new Error("Url is invalid.");
    }
}
exports.validateUrl = validateUrl;
function validateName(name) {
    if (name.length > 300) {
        throw new Error("Name is invalid.");
    }
}
exports.validateName = validateName;
function validateDescription(descriptionTitle) {
    if (descriptionTitle.length > 80) {
        throw new Error("Description cannot be greater than 80 characters.");
    }
}
exports.validateDescription = validateDescription;
function validatePageColors(colors) {
    if (!hexColorRegex.test(colors.buttonColor)
        || !hexColorRegex.test(colors.buttonHoverColor)
        || !hexColorRegex.test(colors.buttonLinkIconColor)
        || !hexColorRegex.test(colors.buttonLinkIconColor)
        || !hexColorRegex.test(colors.backgroundColor)
        || !hexColorRegex.test(colors.textColor)
        || !hexColorRegex.test(colors.socialIconsColor)) {
        throw new Error("Color is invalid.");
    }
}
exports.validatePageColors = validatePageColors;
function getProfileImageUrl(hashedFileName) {
    const host = process.env.NODE_ENV === 'local' ? `http://${process.env.PROFILE_IMAGES_BUCKET_NAME}.s3-website.localhost.localstack.cloud:4566` : `https://${process.env.CDN_DOMAIN_NAME}`;
    return `${host}/${encodeURIComponent(hashedFileName)}`;
}
exports.getProfileImageUrl = getProfileImageUrl;
