import { GeneralException } from "../../excpetions/Exceptions";
import { IPage, IPageInfo, IPageLink } from "../../interfaces/IPage";
import { Page } from "../../schema/PageSchema"
import { validateLinkId, validatePageId } from "../../utils/CoreUtils";

export class PublicPageService {

    async getPageData(id: string): Promise<IPage> {

        validatePageId(id);

        try {

            const data = await Page.get(id);

            const bioInfo: IPageInfo = {
                name: data.bioInfo.name,
                imageUrl: data.bioInfo.imageUrl,
                descriptionTitle: data.bioInfo.descriptionTitle,
            }

            const links: IPageLink[] = data.links ?? []
                .map((link: IPageLink): IPageLink => ({
                    id: link.id,
                    name: link.name,
                    url: link.url,
                    updatedAt: link.updatedAt
                }))

            const socialMediaLinks: IPageLink[] = data.socialMediaLinks ?? []
                .map((link: IPageLink): IPageLink => ({
                    id: link.id,
                    name: link.name,
                    url: link.url,
                    updatedAt: link.updatedAt
                }))


            const pageViews = data.pageViews ?? { views: 0 };

            // Increment page views
            await Page.update({ id }, { pageViews: { views: pageViews.views + 1 } });

            return {
                id: data.id,
                bioInfo,
                links,
                socialMediaLinks,
                pageColors: data.pageColors,
                verified: data.verified,
                createdAt: data.createdAt,
            }

        } catch (error) {
            console.log(error);
            throw new GeneralException("An error ocurred when fetching page.");
        }
    }

    async incrementLinkViews(pageId: string, linkId: string): Promise<boolean> {

        validatePageId(pageId);
        validateLinkId(linkId);

        try {

            const data = await Page.get(pageId);

            let linkViews = data.linkViews || [];

            let link = linkViews.find((l) => l.id === linkId) || {
                id: "default",
                views: 0,
            }

            // If link is not found, create a new one
            if (link.id == "default") {

                const newLink = {
                    id: linkId,
                    views: 0,
                }

                linkViews.push(newLink);
                link = newLink;
            }
            
            const incrementedViewLink = {
                id: link.id,
                views: link.views + 1,
            }

            linkViews = linkViews.map(item => item.id === link.id ? incrementedViewLink : item);

            await Page.update({ id: pageId }, { linkViews });

            return true;

        } catch (error) {
            throw error;
        }
    }
}