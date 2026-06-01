import 'reflect-metadata';
import app from './api/app';
import env from './env';
import { AppDataSource } from './data-source';

const { port, nginx_port } = env;

const getServerUrl = (port: number, nginxPort: number) => {
    if (nginxPort === 80) return 'http://localhost';
    if (nginxPort === 443) return 'https://localhost';
    return `http://localhost:${port}`;
};

AppDataSource.initialize()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on ${getServerUrl(port, nginx_port)}`);
    });
  })
  .catch((error) => {
    console.error('Failed to initialize database connection:', error);
    process.exit(1);
  });