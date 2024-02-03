"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Page = void 0;
const dynamoose_1 = __importDefault(require("dynamoose"));
const dotenv = require('dotenv');
dotenv.config();
dynamoose_1.default.Table.defaults.set({ create: false });
const PageSchema = new dynamoose_1.default.Schema({
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
exports.Page = dynamoose_1.default.model(process.env.BIO_LINKS_TABLE_NAME, PageSchema);
