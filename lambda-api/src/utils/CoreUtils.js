"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateDescription = exports.validateName = exports.validateUrl = exports.validateUrlAllowingNull = exports.validatePageId = exports.formatUrl = void 0;
const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const urlRegex = /[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;
const pageIdRegex = /^[a-zA-Z0-9-]*$/;
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
    if (!urlRegex.test(url)) {
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
