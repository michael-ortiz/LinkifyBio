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
exports.PublicPageService = void 0;
const Exceptions_1 = require("../../excpetions/Exceptions");
const PageSchema_1 = require("../../schema/PageSchema");
class PublicPageService {
    getPageData(id) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield PageSchema_1.Page.get(id);
                const bioInfo = {
                    name: data.bioInfo.name,
                    imageUrl: data.bioInfo.imageUrl,
                    descriptionTitle: data.bioInfo.descriptionTitle,
                };
                const links = (_a = data.links) !== null && _a !== void 0 ? _a : []
                    .map((link) => ({
                    id: link.id,
                    name: link.name,
                    url: link.url,
                    updatedAt: link.updatedAt
                }));
                const socialMediaLinks = (_b = data.socialMediaLinks) !== null && _b !== void 0 ? _b : []
                    .map((link) => ({
                    id: link.id,
                    name: link.name,
                    url: link.url,
                    updatedAt: link.updatedAt
                }));
                return {
                    id: data.id,
                    bioInfo,
                    links,
                    socialMediaLinks,
                    pageColors: data.pageColors,
                    verified: data.verified,
                    createdAt: data.createdAt,
                };
            }
            catch (error) {
                console.log(error);
                throw new Exceptions_1.NotFoundException("Page not found.");
            }
        });
    }
}
exports.PublicPageService = PublicPageService;
