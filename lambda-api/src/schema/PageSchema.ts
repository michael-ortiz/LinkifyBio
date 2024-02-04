import dynamoose from 'dynamoose';
import { IPage } from '../interfaces/IPage';
import { Item } from 'dynamoose/dist/Item';

require('dotenv').config(process.env.NODE_ENV === 'local' && { path: '.env.local' });

if (process.env.NODE_ENV === 'local') {

    dynamoose.Table.defaults.set({ create: true });
    dynamoose.aws.ddb.set(
        new dynamoose.aws.ddb.DynamoDB({
        endpoint: process.env.LOCALSTACK_ENDPOINT,
        credentials: {
            accessKeyId: "test",
            secretAccessKey: "test"
        }
    }));

} else {
    dynamoose.Table.defaults.set({ create: false });
    dynamoose.aws.ddb.set(new dynamoose.aws.ddb.DynamoDB({
        region: "us-east-1"
    }));
}

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
    linkViews: {
        type: Array,
        schema: [
            {
                type: Object,
                schema: {
                    id: String,
                    views: Number
                }
            }
        ]
    },
    pageViews: {
        type: Object,
        schema: {
            views: Number
        }
    },
    verified: {
        type: Boolean,
    },
    createdAt: {
        type: String,
    },
});

export const Page = dynamoose.model<PageModel>(process.env.BIO_LINKS_TABLE_NAME!, PageSchema);