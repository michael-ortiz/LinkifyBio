
import { validateCreatePageRequest, validateUpdatePageInfoRequest } from "../../../utils/RequestValidationUtils";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { Page } from "../../../schema/PageSchema";
import { IPage, IPageColors, IPageInfo, IPageLink } from "../../../interfaces/IPage";
import { getProfileImageUrl, validatePageColors, validatePageId } from "../../../utils/CoreUtils";
import { GeneralException, NotFoundException } from "../../../excpetions/Exceptions";
import crypto from 'crypto';

const s3Client = process.env.NODE_ENV === 'local' ?

    new S3Client({
        region: 'us-east-1', 
        endpoint: process.env.LOCALSTACK_ENDPOINT,
        credentials: {
            accessKeyId: 'test',
            secretAccessKey: 'test',
        },
        forcePathStyle: true,
    })

    : new S3Client({ region: 'us-east-1' });

export default class AdminPagesService {

    async getPage(pageId: string, owner: string): Promise<IPage> {

        validatePageId(pageId);

        try {

            const data = await Page.get({ id: pageId, owner });

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

            return {
                id: data.id,
                bioInfo,
                links,
                socialMediaLinks,
                pageColors: data.pageColors,
                verified: data.verified,
                linkViews: data.linkViews,
                pageViews: data.pageViews,
                createdAt: data.createdAt,
            }

        } catch (error) {
            console.log(error);
            throw new GeneralException("An error ocurred when fetching page.");
        }
    }

    async createPage(request: IPage, owner: string): Promise<IPage> {

        validateCreatePageRequest(request);

        const existingPage = await Page.get({ owner, id: request.id });

        if (existingPage) {
            throw new Error("Page already exists.");
        }

        const page: IPage = {
            id: request.id,
            owner: owner,
            bioInfo: {
                name: request.bioInfo.name,
                imageUrl: request.bioInfo.imageUrl || "",
                descriptionTitle: request.bioInfo.descriptionTitle,
            },
            pageColors: {
                buttonColor: "#000000", // Black Color
                buttonHoverColor: "#808080", // Dark Gray Color
                buttonTextColor: "#ffffff", // White Color
                buttonLinkIconColor: "#ffffff", // White Color
                backgroundColor: "#ffffff", // White Color
                textColor: "#000000", // Black Color
                socialIconsColor: "#8f2f00", // Dark Orange Color
            },
            links: [],
            socialMediaLinks: [],
            pageViews: { views: 0 },
            linkViews: [],
            createdAt: new Date().toISOString(),
            verified: false,
        }

        const bio = new Page(page);

        try {
            await bio.save();
            return page;
        } catch (error) {
            console.log(error);
            throw new Error("Error saving bio. See logs for more details.");
        }
    }

    async checkIfPageIsAvailable(id: string): Promise<{ available: boolean }> {

        validatePageId(id);

        try {

            const data = await Page.get(id);

            if (data === undefined) {
                return { available: true };
            }

            return { available: false };

        } catch (error) {
            console.log(error);
            throw new Error("Alias not found.");
        }
    }

    async updatePageId(id: string, newId: string, owner: string): Promise<IPage> {

        validatePageId(id);
        validatePageId(newId);

        try {

            const originalPage = await Page.get({ id, owner });

            if (originalPage === undefined) {
                throw new NotFoundException("Page not found.");
            }

            if ((await this.checkIfPageIsAvailable(newId)).available) {
                originalPage.id = newId;

                const newPage = new Page(originalPage);

                newPage.save();

                await Page.delete({ id, owner });

                return newPage
            } else {
                throw new Error("New page id is not available.");
            }

        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async updatePageInfo(id: string, info: IPageInfo, owner: string): Promise<IPageInfo> {

        validateUpdatePageInfoRequest(info);

        const existingPage = await Page.get({ id, owner });

        if (!existingPage) {
            throw new Error("Page does not exists. Cannot update info.");
        }

        try {
            await Page.update({ id, owner }, { bioInfo: info });
            return info;
        } catch (error) {
            console.log(error);
            throw new Error("Error updating Page info. See logs for more details.");
        }
    }

    async listPages(owner: string): Promise<any[]> {

        try {
            const response = await Page.scan({ owner }).exec();
            return response
        } catch (error) {
            console.log(error);
            throw new Error("Error listing Page links. See logs for more details.");
        }
    }

    async removePage(id: string, owner: string): Promise<boolean> {

        try {

            await Page.delete({ id, owner });

            return true;
        } catch (error) {
            console.log(error);
            throw new Error("Error removing page. See logs for more details.");
        }
    }

    async uploadProfileImage(owner: string, pageId: string, upload: any) {

        validatePageId(pageId);

        // Check if the file buffer is empty
        if (!upload || !upload.file || !upload.file.data) {
            throw new Error('File is empty');
        }

        const hash = crypto.createHash('sha512');
        hash.update(`${owner}-${pageId}-${new Date().toISOString()}`);
        const hashedFileName = hash.digest('hex');

        const params = {
            Bucket: process.env.PROFILE_IMAGES_BUCKET_NAME!,
            Key: hashedFileName, // Use the hashed file name
            Body: upload.file.data,
        };

        // Uploading files to the bucket
        await s3Client.send(new PutObjectCommand(params));

        return {
            imageUrl: getProfileImageUrl(hashedFileName)
        }
    }



    async updatePageColors(id: string, colors: IPageColors, owner: string): Promise<IPage> {

        validatePageColors(colors);

        const existingPage = await Page.get({ id, owner });

        if (!existingPage) {
            throw new Error("Page does not exists. Cannot update colors.");
        }

        try {
            const page = await Page.update({ id, owner }, { pageColors: colors });
            return page;
        } catch (error) {
            console.log(error);
            throw new Error("Error updating Page info. See logs for more details.");
        }
    }

}