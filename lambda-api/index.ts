import express, { NextFunction, Request, Response } from 'express';
import { NotFoundException, Unauthorized } from './src/excpetions/Exceptions';
import AdminLinksService from './src/services/admin/links/AdminLinksService';
import AdminSocialIconsService from './src/services/admin/social/AdminSocialIconsService';
import AdminPagesService from './src/services/admin/pages/AdminPagesService';
import { PublicPageService } from './src/services/public/PublicPageService';
import { validateToken } from './src/utils/Auth';

const app = express();
const serverless = require('serverless-http');
const fileUpload = require('express-fileupload');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,DELETE,PUT");
  res.setHeader("Access-Control-Allow-Headers", "*");
  next();
});

const adminServices = {
  links: new AdminLinksService(),
  social: new AdminSocialIconsService(),
  pages: new AdminPagesService(),
}

const publicService = new PublicPageService();


app.get('/page/get/:pageId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await publicService.getPageData(req.params.pageId);
    res.json(response);
  } catch (err) {
    catchErrors(err, next);
  }
});

app.put('/:pageId/click/link/:linkId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await publicService.incrementLinkViews(req.params.pageId, req.params.linkId);
    res.json(response);
  } catch (err) {
    catchErrors(err, next);
  }
});

app.get('/admin/page/get/:pageId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = await validateToken(req.headers.authorization);
    const response = await adminServices.pages.getPage(req.params.pageId, token.username);
    res.json(response);
  } catch (err) {
    catchErrors(err, next);
  }
});

app.post('/admin/page/create', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = await validateToken(req.headers.authorization);
    const response = await adminServices.pages.createPage(req.body, token.username);
    res.json(response);
  } catch (err) {
    catchErrors(err, next);
  }
});

app.post('/admin/page/:id/link/add', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = await validateToken(req.headers.authorization);
    const response = await adminServices.links.addLink(req.params.id, req.body, token.username);
    res.json(response);
  } catch (err) {
    catchErrors(err, next);
  }
});

app.post('/admin/page/:id/link/update', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = await validateToken(req.headers.authorization);
    const response = await adminServices.links.updateLink(req.params.id, req.body, token.username);
    res.json(response);
  } catch (err) {
    catchErrors(err, next);
  }
});


app.post('/admin/page/:id/link/organize', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = await validateToken(req.headers.authorization);
    const response = await adminServices.links.organizeLinks(req.params.id, req.body, token.username);
    res.json(response);
  } catch (err) {
    catchErrors(err, next);
  }
});

app.delete('/admin/page/:id/link/remove/:linkId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = await validateToken(req.headers.authorization);
    const response = await adminServices.links.removeLink(req.params.id, req.params.linkId, token.username);
    res.json(response);
  } catch (err) {
    catchErrors(err, next);
  }
});

app.post('/admin/page/:id/social/link/add', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = await validateToken(req.headers.authorization);
    const response = await adminServices.social.addSocialMediaLink(req.params.id, req.body, token.username);
    res.json(response);
  } catch (err) {
    catchErrors(err, next);
  }
});

app.delete('/admin/page/:id/social/link/remove/:linkId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = await validateToken(req.headers.authorization);
    const response = await adminServices.social.removeSocialMediaLink(req.params.id, req.params.linkId, token.username);
    res.json(response);
  } catch (err) {
    catchErrors(err, next);
  }
});

app.post('/admin/page/:id/social/link/organize', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = await validateToken(req.headers.authorization);
    const response = await adminServices.social.organizeSocialMediaLinks(req.params.id, req.body, token.username);
    res.json(response);
  } catch (err) {
    catchErrors(err, next);
  }
});

app.post('/admin/page/:id/social/link/update', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = await validateToken(req.headers.authorization);
    const response = await adminServices.social.updateSocialMediaLink(req.params.id, req.body, token.username);
    res.json(response);
  } catch (err) {
    catchErrors(err, next);
  }
});

app.post('/admin/page/:id/info/update', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = await validateToken(req.headers.authorization);

    const response = await adminServices.pages.updatePageInfo(req.params.id, req.body, token.username);
    res.json(response);
  } catch (err) {
    catchErrors(err, next);
  }
});

app.post('/admin/page/:id/update/pageId/:newPageId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = await validateToken(req.headers.authorization);
    const response = await adminServices.pages.updatePageId(req.params.id, req.params.newPageId, token.username);
    res.json(response);
  } catch (err) {
    catchErrors(err, next);
  }
});

app.get('/admin/page/list', async (req: Request, res: Response, next: NextFunction) => {
  try {

    const token = await validateToken(req.headers.authorization);

    const response = await adminServices.pages.listPages(token.username);
    res.json(response);
  } catch (err) {
    catchErrors(err, next);
  }
});

app.post('/admin/upload/profile/image/id/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {

    const token = await validateToken(req.headers.authorization);

    const response = await adminServices.pages.uploadProfileImage(token.username, req.params.id, req.files);
    res.json(response);
  } catch (err) {
    catchErrors(err, next);
  }
});

app.delete('/admin/page/:id/remove', async (req: Request, res: Response, next: NextFunction) => {
  try {

    const token = await validateToken(req.headers.authorization);

    const response = await adminServices.pages.removePage(req.params.id, token.username);
    res.json(response);
  } catch (err) {
    catchErrors(err, next);
  }
});

app.get('/admin/page/:id/availability', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await validateToken(req.headers.authorization);
    const response = await adminServices.pages.checkIfPageIsAvailable(req.params.id);
    res.json(response);
  } catch (err) {
    catchErrors(err, next);
  }
});

app.post('/admin/page/:id/update/colors', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = await validateToken(req.headers.authorization);
    const response = await adminServices.pages.updatePageColors(req.params.id, req.body, token.username);
    res.json(response);
  } catch (err) {
    catchErrors(err, next);
  }
});


// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(err.status || 500).send(err.message);
});

const catchErrors = (error: unknown, next: NextFunction) => {

  if (error instanceof NotFoundException) {
    next(new NotFoundException(error.message));
  }

  if (error instanceof Unauthorized) {
    next(new Unauthorized(error.message));
  }

  next(error);
}

const handler = serverless(app);

const startServer = async () => {
  app.listen(3500, () => {
    console.log("listening on port 3500!");
  });
}

startServer();

module.exports.handler = (event: any, context: any, callback: any) => {
  const response = handler(event, context, callback);
  return response;
};