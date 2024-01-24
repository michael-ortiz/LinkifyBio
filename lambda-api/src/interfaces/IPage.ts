export interface IPage {
    id: string;
    owner?: string;
    bioInfo: IPageInfo
    links?: IPageLink[],
    socialMediaLinks?: IPageLink[],
    verified?: boolean,
    createdAt?: string
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