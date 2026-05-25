import express from 'express';
import fs from 'fs';
import path from 'path';
import helloRouter from './routes/helloRoute';
import createViewRouter from './routes/viewRoutes';

const app = express();

const publicDir = path.join(__dirname, '..', '..', 'src', 'front', 'public');

app.use(express.json());

if (fs.existsSync(publicDir)) {
  app.use(express.static(publicDir));
  app.use('/public', express.static(publicDir));
}

app.use('/api', helloRouter);
app.use('/', createViewRouter());

app.use((req, res) => {
  res.status(404).send('Página não encontrada');
});

export default app;