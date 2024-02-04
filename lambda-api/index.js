"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Exceptions_1 = require("./src/excpetions/Exceptions");
const AdminLinksService_1 = __importDefault(require("./src/services/admin/links/AdminLinksService"));
const AdminSocialIconsService_1 = __importDefault(require("./src/services/admin/social/AdminSocialIconsService"));
const AdminPagesService_1 = __importDefault(require("./src/services/admin/pages/AdminPagesService"));
const PublicPageService_1 = require("./src/services/public/PublicPageService");
const Auth_1 = require("./src/utils/Auth");
const app = (0, express_1.default)();
const serverless = require('serverless-http');
const fileUpload = require('express-fileupload');
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(fileUpload());
app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,DELETE,PUT");
    res.setHeader("Access-Control-Allow-Headers", "*");
    next();
});
const adminServices = {
    links: new AdminLinksService_1.default(),
    social: new AdminSocialIconsService_1.default(),
    pages: new AdminPagesService_1.default(),
};
const publicService = new PublicPageService_1.PublicPageService();
app.get('/page/get/:pageId', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield publicService.getPageData(req.params.pageId);
        res.json(response);
    }
    catch (err) {
        catchErrors(err, next);
    }
}));
app.put('/:pageId/click/link/:linkId', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield publicService.incrementLinkViews(req.params.pageId, req.params.linkId);
        res.json(response);
    }
    catch (err) {
        catchErrors(err, next);
    }
}));
app.get('/admin/page/get/:pageId', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = yield (0, Auth_1.validateToken)(req.headers.authorization);
        const response = yield adminServices.pages.getPage(req.params.pageId, token.username);
        res.json(response);
    }
    catch (err) {
        catchErrors(err, next);
    }
}));
app.post('/admin/page/create', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = yield (0, Auth_1.validateToken)(req.headers.authorization);
        const response = yield adminServices.pages.createPage(req.body, token.username);
        res.json(response);
    }
    catch (err) {
        catchErrors(err, next);
    }
}));
app.post('/admin/page/:id/link/add', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = yield (0, Auth_1.validateToken)(req.headers.authorization);
        const response = yield adminServices.links.addLink(req.params.id, req.body, token.username);
        res.json(response);
    }
    catch (err) {
        catchErrors(err, next);
    }
}));
app.post('/admin/page/:id/link/update', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = yield (0, Auth_1.validateToken)(req.headers.authorization);
        const response = yield adminServices.links.updateLink(req.params.id, req.body, token.username);
        res.json(response);
    }
    catch (err) {
        catchErrors(err, next);
    }
}));
app.post('/admin/page/:id/link/organize', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = yield (0, Auth_1.validateToken)(req.headers.authorization);
        const response = yield adminServices.links.organizeLinks(req.params.id, req.body, token.username);
        res.json(response);
    }
    catch (err) {
        catchErrors(err, next);
    }
}));
app.delete('/admin/page/:id/link/remove/:linkId', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = yield (0, Auth_1.validateToken)(req.headers.authorization);
        const response = yield adminServices.links.removeLink(req.params.id, req.params.linkId, token.username);
        res.json(response);
    }
    catch (err) {
        catchErrors(err, next);
    }
}));
app.post('/admin/page/:id/social/link/add', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = yield (0, Auth_1.validateToken)(req.headers.authorization);
        const response = yield adminServices.social.addSocialMediaLink(req.params.id, req.body, token.username);
        res.json(response);
    }
    catch (err) {
        catchErrors(err, next);
    }
}));
app.delete('/admin/page/:id/social/link/remove/:linkId', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = yield (0, Auth_1.validateToken)(req.headers.authorization);
        const response = yield adminServices.social.removeSocialMediaLink(req.params.id, req.params.linkId, token.username);
        res.json(response);
    }
    catch (err) {
        catchErrors(err, next);
    }
}));
app.post('/admin/page/:id/social/link/organize', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = yield (0, Auth_1.validateToken)(req.headers.authorization);
        const response = yield adminServices.social.organizeSocialMediaLinks(req.params.id, req.body, token.username);
        res.json(response);
    }
    catch (err) {
        catchErrors(err, next);
    }
}));
app.post('/admin/page/:id/social/link/update', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = yield (0, Auth_1.validateToken)(req.headers.authorization);
        const response = yield adminServices.social.updateSocialMediaLink(req.params.id, req.body, token.username);
        res.json(response);
    }
    catch (err) {
        catchErrors(err, next);
    }
}));
app.post('/admin/page/:id/info/update', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = yield (0, Auth_1.validateToken)(req.headers.authorization);
        const response = yield adminServices.pages.updatePageInfo(req.params.id, req.body, token.username);
        res.json(response);
    }
    catch (err) {
        catchErrors(err, next);
    }
}));
app.post('/admin/page/:id/update/pageId/:newPageId', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = yield (0, Auth_1.validateToken)(req.headers.authorization);
        const response = yield adminServices.pages.updatePageId(req.params.id, req.params.newPageId, token.username);
        res.json(response);
    }
    catch (err) {
        catchErrors(err, next);
    }
}));
app.get('/admin/page/list', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = yield (0, Auth_1.validateToken)(req.headers.authorization);
        const response = yield adminServices.pages.listPages(token.username);
        res.json(response);
    }
    catch (err) {
        catchErrors(err, next);
    }
}));
app.post('/admin/upload/profile/image/id/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = yield (0, Auth_1.validateToken)(req.headers.authorization);
        const response = yield adminServices.pages.uploadProfileImage(token.username, req.params.id, req.files);
        res.json(response);
    }
    catch (err) {
        catchErrors(err, next);
    }
}));
app.delete('/admin/page/:id/remove', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = yield (0, Auth_1.validateToken)(req.headers.authorization);
        const response = yield adminServices.pages.removePage(req.params.id, token.username);
        res.json(response);
    }
    catch (err) {
        catchErrors(err, next);
    }
}));
app.get('/admin/page/:id/availability', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, Auth_1.validateToken)(req.headers.authorization);
        const response = yield adminServices.pages.checkIfPageIsAvailable(req.params.id);
        res.json(response);
    }
    catch (err) {
        catchErrors(err, next);
    }
}));
app.post('/admin/page/:id/update/colors', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = yield (0, Auth_1.validateToken)(req.headers.authorization);
        const response = yield adminServices.pages.updatePageColors(req.params.id, req.body, token.username);
        res.json(response);
    }
    catch (err) {
        catchErrors(err, next);
    }
}));
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).send(err.message);
});
const catchErrors = (error, next) => {
    if (error instanceof Exceptions_1.NotFoundException) {
        next(new Exceptions_1.NotFoundException(error.message));
    }
    if (error instanceof Exceptions_1.Unauthorized) {
        next(new Exceptions_1.Unauthorized(error.message));
    }
    next(error);
};
const handler = serverless(app);
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    app.listen(3500, () => {
        console.log("listening on port 3500!");
    });
});
startServer();
module.exports.handler = (event, context, callback) => {
    const response = handler(event, context, callback);
    return response;
};
