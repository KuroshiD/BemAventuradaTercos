import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

const projectRoot = path.join(__dirname, '..', '..');
const viewsDir = path.join(projectRoot, 'front', 'views');

const registerViewRoutes = (
  router: Router,
  dir: string,
  routeSegments: string[] = [],
  isRoot = false
) => {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const entryPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      const nextSegments = [...routeSegments];
      if (!(isRoot && entry.name.toLowerCase() === 'index')) {
        nextSegments.push(entry.name);
      }
      registerViewRoutes(router, entryPath, nextSegments, false);
      continue;
    }

    if (!entry.isFile() || path.extname(entry.name).toLowerCase() !== '.html') {
      continue;
    }

    const name = path.basename(entry.name, '.html');
    const fileSegments = [...routeSegments];

    if (name.toLowerCase() !== 'index') {
      fileSegments.push(name);
    }

    const route = '/' + fileSegments.filter(Boolean).join('/');

    // Pula a rota raiz '/' — será registrada exclusivamente em createViewRouter
    if (route === '/') continue;

    router.get(route, (_req: Request, res: Response) => {
      res.sendFile(entryPath);
    });
  }
};

const createViewRouter = (): Router => {
  const router = Router();

  if (!fs.existsSync(viewsDir)) {
    return router;
  }

  registerViewRoutes(router, viewsDir, [], true);

  const indexFile = path.join(viewsDir, 'index.html');
  if (fs.existsSync(indexFile)) {
    router.get('/', (_req: Request, res: Response) => {
      res.sendFile(indexFile);
    });
    router.get('/index.html', (_req: Request, res: Response) => {
      res.sendFile(indexFile);
    });
  }

  return router;
};

export default createViewRouter;