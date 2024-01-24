import dynamoose from 'dynamoose';
const dotenv = require('dotenv');
dotenv.config();

dynamoose.Table.defaults.set({create: false});


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
    verified: {
        type: Boolean,
    },
    createdAt: {
        type: String,
    },
});

export const Page = dynamoose.model(process.env.BIO_LINKS_TABLE_NAME!, PageSchema);