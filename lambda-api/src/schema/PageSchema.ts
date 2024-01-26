import dynamoose from 'dynamoose';
import { IPage, IPageInfo, IPageLink } from '../interfaces/IPage';
import { Item } from 'dynamoose/dist/Item';
const dotenv = require('dotenv');
dotenv.config();

dynamoose.Table.defaults.set({create: false});

export interface PageModel extends IPage, Item { }

const PageSchema = new dynamoose.Schema({
    id: {
        type: String,
        hashKey: true
    },
    owner: {
        type: String,
    },
    bioInfo: {
        type: Object,
        schema: {
            name: String,
            imageUrl: String,
            descriptionTitle: String,
        },
    },
    links: {
        type: Array,
        schema: [{
            type: Object,
            schema: {
                id: String,
                name: String,
                url: String,
                updatedAt: String,
            },
        }],
    },
    socialMediaLinks: {
        type: Array,
        schema: [{
            type: Object,
            schema: {
                id: String,
                name: String,
                url: String,
                updatedAt: String,
            },
        }],
    },
    pageColors: {
        type: Object,
        schema: {
            buttonColor: String,
            buttonHoverColor: String,
            buttonTextColor: String,
            buttonLinkIconColor: String,
            backgroundColor: String,
            textColor: String,
            socialIconsColor: String
        },
    },
    verified: {
        type: Boolean,
    },
    createdAt: {
        type: String,
    },
});

export const Page = dynamoose.model<PageModel>(process.env.BIO_LINKS_TABLE_NAME!, PageSchema);