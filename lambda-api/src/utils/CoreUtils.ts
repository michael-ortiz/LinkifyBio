import { IPageColors } from "../interfaces/IPage";

const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const urlRegex = /[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/
const pageIdRegex = /^[a-zA-Z0-9-]*$/
const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

export function formatUrl(url: string) {


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

export function validatePageId(id: string) {

    if (!pageIdRegex.test(id)) {
        throw new Error("Id can only contain letters and dashes.");
    }

    if (id.length > 120) {
        throw new Error("Id cannot be longer than 120 characters.");
    }
}

export function validateUrlAllowingNull(url: string) {

    if (!url) {
        return;
    }

    if (!urlRegex.test(url)) {
        throw new Error("Url is invalid.");
    }
}

export function validateUrl(url: string) {

    if (!urlRegex.test(url)) {
        throw new Error("Url is invalid.");
    }
}

export function validateName(name: string) {

    if (name.length > 300) {
        throw new Error("Name is invalid.");
    }
}

export function validateDescription(descriptionTitle: string) {

    if (descriptionTitle.length > 80) {
        throw new Error("Description cannot be greater than 80 characters.");
    }
}

export function validatePageColors(colors: IPageColors) {

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