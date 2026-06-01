import express from 'express';
import fs from 'fs';
import path from 'path';
import createViewRouter from './routes/viewRoutes';
import authRouter from './routes/auth.routes';
import galleryRouter from './routes/gallery.routes';
import pecasRouter from './routes/pecas.routes';

const app = express();

const publicDir = path.join(__dirname, '..', '..', 'src', 'front', 'public');

app.use(express.json());

if (fs.existsSync(publicDir)) {
  app.use(express.static(publicDir));
  app.use('/public', express.static(publicDir));
}

app.use('/adm', authRouter);
app.use('/adm', galleryRouter);
app.use('/adm', pecasRouter);
app.use('/', createViewRouter());

app.use((_req, res) => {
  res.status(404).send('Página não encontrada');
});

export default app;