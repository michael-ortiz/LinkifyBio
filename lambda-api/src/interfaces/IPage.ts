import { Item } from "dynamoose/dist/Item";

export interface IPage {
    id: string;
    owner?: string;
    bioInfo: IPageInfo
    links?: IPageLink[],
    socialMediaLinks?: IPageLink[],
    pageColors: IPageColors,
    linkViews?: ILinkViews[],
    pageViews?: IPageViews,
    verified?: boolean,
    createdAt?: string
}

export interface IPageColors {
    buttonColor: string;
    buttonHoverColor: string;
    buttonTextColor: string;
    buttonLinkIconColor: string;
    backgroundColor: string
    textColor: string;
    socialIconsColor: string;
}

export interface IPageInfo {
    name: string;
    imageUrl: string;
    descriptionTitle: string;
}

export interface IPageLink {
    id: string;
    name?: string;
    url: string;
    updatedAt?: string
}

export interface ILinkViews {
    id: string;
    views: number;
}

export interface IPageViews {
    views: number;
}