import { IPageLink } from "../../../interfaces/IPage";
import { Page } from "../../../schema/PageSchema";
import { formatUrl } from "../../../utils/CoreUtils";
import { validateAddBioLinkRequest, validateModifyBioLinkRequest } from "../../../utils/RequestValidationUtils";
const { v4: uuidv4 } = require('uuid');

export default class AdminLinksService {

    async addLink(id: string, link: IPageLink, owner: string): Promise<IPageLink> {

        validateAddBioLinkRequest(link);

        try {

            const response = await Page.get({ id, owner });

            let links: IPageLink[] = response.links || [];

            link = {
                id: uuidv4(),
                name: link.name,
                url: formatUrl(link.url),
                updatedAt: new Date().toISOString(),
            }

            links.push(link);

            await Page.update({ id, owner }, { links });

            return link;
        } catch (error) {
            console.log(error);
            throw new Error("Error adding link. See logs for more details.");
        }
    }

    async removeLink(id: string, linkId: string, owner: string): Promise<boolean> {

        try {

            const response = await Page.get({ id, owner });

            let links: IPageLink[] = response.links || [];

            links = links.filter((l: IPageLink) => l.id !== linkId);

            await Page.update({ id, owner }, { links: links });

            return true;
        } catch (error) {
            console.log(error);
            throw new Error("Error removing link. See logs for more details.");
        }
    }

    async updateLink(id: string, link: IPageLink, owner: string): Promise<IPageLink> {

        validateModifyBioLinkRequest(link);

        try {

            const response = await Page.get({ id, owner });

            let links: IPageLink[] = response.links || [];

            links = links.map((l: IPageLink) => l.id === link.id ? link : l);

            await Page.update({ id, owner }, { links });

            return link;
        } catch (error) {
            console.log(error);
            throw new Error("Error updating link. See logs for more details.");
        }
    }

    async organizeLinks(id: string, ids: string[], owner: string): Promise<IPageLink[]> {

        try {

            const response = await Page.get({ id, owner });

            let links: IPageLink[] = response.links || [];

            links = links.sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id));

            await Page.update({ id, owner }, { links });

            return links;
        } catch (error) {
            console.log(error);
            throw new Error("Error updating link. See logs for more details.");
        }
    }

}