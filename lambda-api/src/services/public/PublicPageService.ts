import { NotFoundException } from "../../excpetions/Exceptions";
import { IPage, IPageInfo, IPageLink } from "../../interfaces/IPage";
import { Page } from "../../schema/PageSchema"

export class PublicPageService {

    async getPageData(id: string): Promise<IPage> {

        try {

            const data  = await Page.get(id);
            
            const bioInfo : IPageInfo = {
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
            throw new NotFoundException("Page not found.");   
        }
    }
}