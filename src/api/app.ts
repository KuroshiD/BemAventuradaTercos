import express from 'express';
import fs from 'fs';
import path from 'path';
import createViewRouter from './routes/viewRoutes';
import authRouter from './routes/auth.routes';
import galleryRouter from './routes/gallery.routes';
import pecasRouter from './routes/pecas.routes';
import publicRouter from './routes/public.routes';

const app = express();

const sourcePublicDir = path.join(__dirname, '..', '..', 'src', 'front', 'public');
const distPublicDir = path.join(__dirname, '..', '..', 'front', 'public');
const publicDir = fs.existsSync(distPublicDir) ? distPublicDir : sourcePublicDir;

app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

if (fs.existsSync(publicDir)) {
  app.use(express.static(publicDir));
  app.use('/public', express.static(publicDir));
}

app.use('/api', publicRouter);
app.use('/adm', authRouter);
app.use('/adm', galleryRouter);
app.use('/adm', pecasRouter);
app.use('/', createViewRouter());

app.use((_req, res) => {
  res.status(404).send('Página não encontrada');
});

export default app;