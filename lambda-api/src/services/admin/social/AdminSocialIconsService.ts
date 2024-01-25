import { IPageLink } from "../../../interfaces/IPage";
import { Page } from "../../../schema/PageSchema";
import { formatUrl } from "../../../utils/CoreUtils";
import { validateAddBioSocialMediaLinkRequest, validateModifySocialMediaLinkRequest } from "../../../utils/RequestValidationUtils";
const { v4: uuidv4 } = require('uuid');

export default class AdminSocialIconsService {

    async organizeSocialMediaLinks(id: string, ids: string[], owner: string): Promise<IPageLink[]> {

        try {

            const response = await Page.get({ id, owner });

            let socialMediaLinks: IPageLink[] = response.socialMediaLinks || [];

            socialMediaLinks = socialMediaLinks.sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id));

            await Page.update({ id, owner }, { socialMediaLinks });

            return socialMediaLinks;
        } catch (error) {
            console.log(error);
            throw new Error("Error organizing social media link. See logs for more details.");
        }
    }

    async addSocialMediaLink(id: string, link: IPageLink, owner: string): Promise<IPageLink> {

        validateAddBioSocialMediaLinkRequest(link);

        try {

            const response = await Page.get({ id, owner });

            let socialMediaLinks: IPageLink[] = response.socialMediaLinks || [];

            link = {
                id: uuidv4(),
                url: formatUrl(link.url),
                updatedAt: new Date().toISOString(),
            }

            socialMediaLinks.push(link);

            await Page.update({ id, owner }, { socialMediaLinks });

            return link;
        } catch (error) {
            console.log(error);
            throw new Error("Error adding social media link. See logs for more details.");
        }
    }

    async removeSocialMediaLink(id: string, linkId: string, owner: string): Promise<boolean> {

        try {

            const response = await Page.get({ id, owner });

            let socialMediaLinks: IPageLink[] = response.socialMediaLinks || [];

            socialMediaLinks = socialMediaLinks.filter((l: IPageLink) => l.id !== linkId);

            await Page.update({ id, owner }, { socialMediaLinks: socialMediaLinks });

            return true;
        } catch (error) {
            console.log(error);
            throw new Error("Error removing social media link. See logs for more details.");
        }
    }

    async updateSocialMediaLink(id: string, link: IPageLink, owner: string): Promise<IPageLink> {

        validateModifySocialMediaLinkRequest(link);

        try {

            const response = await Page.get({ id, owner });

            let socialMediaLinks: IPageLink[] = response.socialMediaLinks || [];

            socialMediaLinks = socialMediaLinks.map((l: IPageLink) => l.id === link.id ? link : l);

            await Page.update({ id, owner }, { socialMediaLinks });

            return link;
        } catch (error) {
            console.log(error);
            throw new Error("Error updating link. See logs for more details.");
        }
    }
}