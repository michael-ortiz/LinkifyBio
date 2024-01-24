import { IPage, IPageInfo, IPageLink } from "../interfaces/IPage";
import { validateDescription, validateName, validatePageId, validateUrl, validateUrlAllowingNull } from "./CoreUtils";


export function validateModifyBioLinkRequest(request: IPageLink) {

    if (!request.id) {
        throw new Error("Id is required.");
    }

    if (!request.name) {
        throw new Error("Name is required.");
    }

    if (!request.url) {
        throw new Error("Url is required.");
    }

    validatePageId(request.id);

    validateName(request.name);

    validateUrl(request.url);

}

export function validateModifySocialMediaLinkRequest(request: IPageLink) {

    if (!request.id) {
        throw new Error("Id is required.");
    }

    if (!request.url) {
        throw new Error("Url is required.");
    }

    validatePageId(request.id);

    validateUrl(request.url);
}

export function validateAddBioLinkRequest(request: IPageLink) {

    if (!request.name) {
        throw new Error("Name is required.");
    }

    if (!request.url) {
        throw new Error("Url is required.");
    }

    validateName(request.name);
    
    validateUrl(request.url);
}

export function validateAddBioSocialMediaLinkRequest(request: IPageLink) {

    if (!request.url) {
        throw new Error("Url is required.");
    }

    validateUrl(request.url);
}

export function validateCreatePageRequest(request: IPage) {

    if (!request.id) {
        throw new Error("Id is required.");
    }

    if (!request.bioInfo) {
        throw new Error("BioInfo is required.");
    }

    validatePageId(request.id);

    validateName(request.bioInfo.name);

    validateUrlAllowingNull(request.bioInfo.imageUrl);

    validateDescription(request.bioInfo.descriptionTitle);
}

export function validateUpdatePageInfoRequest(request: IPageInfo) {

    if (!request.name) {
        throw new Error("Name is required.");
    }

    if (!request.descriptionTitle) {
        throw new Error("DescriptionTitle is required.");
    }

    validateName(request.name);

    if (request.imageUrl) {
        validateUrl(request.imageUrl);
    }

    validateDescription(request.descriptionTitle);
}