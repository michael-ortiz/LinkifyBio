import dynamoose from 'dynamoose';
import { IPage } from '../interfaces/IPage';
import { Item } from 'dynamoose/dist/Item';

const dotenv = require('dotenv');
dotenv.config();

if (process.env.NODE_ENV === 'local') {
    console.log('Using local dynamodb');
    dynamoose.Table.defaults.set({ create: true });
    const ddb = new dynamoose.aws.ddb.DynamoDB({
        endpoint: "http://localhost:4566",
        credentials: {
            accessKeyId: "test",
            secretAccessKey: "test"
        }
    });
    dynamoose.aws.ddb.set(ddb);

} else {

    const ddb = new dynamoose.aws.ddb.DynamoDB({
        region: "us-east-1"
    });
    dynamoose.aws.ddb.set(ddb);
    dynamoose.Table.defaults.set({ create: false });
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