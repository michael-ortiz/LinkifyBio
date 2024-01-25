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
const PageSchema_1 = require("../../../schema/PageSchema");
const CoreUtils_1 = require("../../../utils/CoreUtils");
const RequestValidationUtils_1 = require("../../../utils/RequestValidationUtils");
const { v4: uuidv4 } = require('uuid');
class AdminSocialIconsService {
    organizeSocialMediaLinks(id, ids, owner) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield PageSchema_1.Page.get({ id, owner });
                let socialMediaLinks = response.socialMediaLinks || [];
                socialMediaLinks = socialMediaLinks.sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id));
                yield PageSchema_1.Page.update({ id, owner }, { socialMediaLinks });
                return socialMediaLinks;
            }
            catch (error) {
                console.log(error);
                throw new Error("Error organizing social media link. See logs for more details.");
            }
        });
    }
    addSocialMediaLink(id, link, owner) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, RequestValidationUtils_1.validateAddBioSocialMediaLinkRequest)(link);
            try {
                const response = yield PageSchema_1.Page.get({ id, owner });
                let socialMediaLinks = response.socialMediaLinks || [];
                link = {
                    id: uuidv4(),
                    url: (0, CoreUtils_1.formatUrl)(link.url),
                    updatedAt: new Date().toISOString(),
                };
                socialMediaLinks.push(link);
                yield PageSchema_1.Page.update({ id, owner }, { socialMediaLinks });
                return link;
            }
            catch (error) {
                console.log(error);
                throw new Error("Error adding social media link. See logs for more details.");
            }
        });
    }
    removeSocialMediaLink(id, linkId, owner) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield PageSchema_1.Page.get({ id, owner });
                let socialMediaLinks = response.socialMediaLinks || [];
                socialMediaLinks = socialMediaLinks.filter((l) => l.id !== linkId);
                yield PageSchema_1.Page.update({ id, owner }, { socialMediaLinks: socialMediaLinks });
                return true;
            }
            catch (error) {
                console.log(error);
                throw new Error("Error removing social media link. See logs for more details.");
            }
        });
    }
    updateSocialMediaLink(id, link, owner) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, RequestValidationUtils_1.validateModifySocialMediaLinkRequest)(link);
            try {
                const response = yield PageSchema_1.Page.get({ id, owner });
                let socialMediaLinks = response.socialMediaLinks || [];
                socialMediaLinks = socialMediaLinks.map((l) => l.id === link.id ? link : l);
                yield PageSchema_1.Page.update({ id, owner }, { socialMediaLinks });
                return link;
            }
            catch (error) {
                console.log(error);
                throw new Error("Error updating link. See logs for more details.");
            }
        });
    }
}
exports.default = AdminSocialIconsService;
